const { Memory } = require('mem0ai');

let memory;

const getMemory = () => {
  if (!memory) {
    memory = new Memory({
      vector_store: {
        provider: 'mongodb_atlas',
        config: {
          connection_string: process.env.MONGODB_URI,
          db_name: 'recoverai',
          collection_name: 'memories',
          embedding_model_dims: 1536,
          index_name: 'memory_vector_index',
        },
      },
      llm: {
        provider: 'openai',
        config: {
          api_key: process.env.OPENAI_API_KEY,
          model: 'gpt-4o-mini',
        },
      },
      embedder: {
        provider: 'openai',
        config: {
          api_key: process.env.OPENAI_API_KEY,
          model: 'text-embedding-3-small',
        },
      },
    });
  }
  return memory;
};

const addMemory = async (userId, text) => {
  const m = getMemory();
  return m.add(text, { user_id: userId });
};

const searchMemory = async (userId, query) => {
  const m = getMemory();
  const results = await m.search(query, { user_id: userId, limit: 5 });
  return results.results || results || [];
};

module.exports = { addMemory, searchMemory };
