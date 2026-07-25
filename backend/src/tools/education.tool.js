const mongoose = require('mongoose');
const { openai } = require('../services/openai.service');

const toolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'educational_search',
      description: 'Search trusted medical educational content (WHO, SAMHSA, NIDA) to answer recovery-related questions.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'The recovery question or topic to search for' },
        },
        required: ['query'],
      },
    },
  },
];

const execute = async ({ args }) => {
  const embeddingRes = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: args.query,
  });
  const queryEmbedding = embeddingRes.data[0].embedding;

  const db = mongoose.connection.db;
  const collection = db.collection('education_resources');

  const results = await collection.aggregate([
    {
      $vectorSearch: {
        index: 'education_vector_index',
        path: 'embedding',
        queryVector: queryEmbedding,
        numCandidates: 50,
        limit: 3,
      },
    },
    {
      $project: { title: 1, content: 1, source: 1, score: { $meta: 'vectorSearchScore' } },
    },
  ]).toArray();

  if (!results.length) return 'No relevant educational content found.';
  return results
    .map((r) => `[${r.source}] ${r.title}:\n${r.content}`)
    .join('\n\n');
};

module.exports = { toolDefinitions, execute };
