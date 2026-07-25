const { openai } = require('../services/openai.service');

const toolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'generate_emergency_script',
      description: 'Generate a personalized emergency intervention plan when the user is at high or emergency risk.',
      parameters: {
        type: 'object',
        properties: {
          user_context: {
            type: 'string',
            description: 'Brief description of what the user is experiencing right now',
          },
          user_memories: {
            type: 'string',
            description: 'Relevant memories about the user\'s preferences and support system',
          },
        },
        required: ['user_context'],
      },
    },
  },
];

const execute = async ({ args }) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a compassionate emergency intervention specialist for substance use disorder recovery.
Generate a personalized, numbered list of 4–5 immediate action steps the user can take RIGHT NOW.
Be specific, warm, and actionable. Use simple language. Always include:
- A grounding or breathing exercise
- Encouraging them to call a trusted person or crisis line (988)
- A short motivational reminder
Keep the entire response under 200 words.`,
      },
      {
        role: 'user',
        content: `User situation: ${args.user_context}\n\nUser memories: ${args.user_memories || 'None available'}`,
      },
    ],
  });

  return response.choices[0].message.content;
};

module.exports = { toolDefinitions, execute };
