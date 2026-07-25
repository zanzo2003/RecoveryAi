const { openai } = require('../services/openai.service');

const toolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'assess_risk',
      description: 'Analyze the conversation to assess the user\'s current relapse risk level.',
      parameters: {
        type: 'object',
        properties: {
          conversation_summary: {
            type: 'string',
            description: 'A brief summary of what the user has said in the conversation',
          },
        },
        required: ['conversation_summary'],
      },
    },
  },
];

const execute = async ({ args }) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a clinical risk assessment tool for substance use disorder recovery.
Analyze the user's message and classify relapse risk.
Return JSON: { "level": "low"|"medium"|"high"|"emergency", "reasoning": "one sentence" }

Levels:
- low: stable, positive, no signs of craving or distress
- medium: mild craving, stress, or emotional difficulty
- high: strong craving, active thoughts of using, significant distress
- emergency: actively using, expressing self-harm, suicidal ideation, or immediate danger`,
      },
      {
        role: 'user',
        content: args.conversation_summary,
      },
    ],
  });

  return response.choices[0].message.content;
};

module.exports = { toolDefinitions, execute };
