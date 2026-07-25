const { addMemory, searchMemory } = require('../services/mem0.service');

const toolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'memory_search',
      description: 'Search the user\'s personal recovery memories to personalize the response.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'What to search for in user memories' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'memory_add',
      description: 'Store a new important fact or preference about the user for future conversations.',
      parameters: {
        type: 'object',
        properties: {
          fact: { type: 'string', description: 'The fact or preference to remember about the user' },
        },
        required: ['fact'],
      },
    },
  },
];

const execute = async ({ name, args }, userId) => {
  if (name === 'memory_search') {
    const results = await searchMemory(userId, args.query);
    if (!results.length) return 'No relevant memories found.';
    return results.map((r) => r.memory || r.text || JSON.stringify(r)).join('\n');
  }
  if (name === 'memory_add') {
    await addMemory(userId, args.fact);
    return 'Memory saved.';
  }
  return 'Unknown memory operation.';
};

module.exports = { toolDefinitions, execute };
