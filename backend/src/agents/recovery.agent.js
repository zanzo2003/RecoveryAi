const { openai } = require('../services/openai.service');
const SYSTEM_PROMPT = require('../prompts/recovery.system');
const memoryTool = require('../tools/memory.tool');
const educationTool = require('../tools/education.tool');
const riskTool = require('../tools/risk.tool');
const emergencyTool = require('../tools/emergency.tool');

const ALL_TOOL_DEFINITIONS = [
  ...memoryTool.toolDefinitions,
  ...educationTool.toolDefinitions,
  ...riskTool.toolDefinitions,
  ...emergencyTool.toolDefinitions,
];

const dispatchTool = async (toolName, args, userId) => {
  if (toolName === 'memory_search' || toolName === 'memory_add') {
    return memoryTool.execute({ name: toolName, args }, userId);
  }
  if (toolName === 'educational_search') {
    return educationTool.execute({ args });
  }
  if (toolName === 'assess_risk') {
    return riskTool.execute({ args });
  }
  if (toolName === 'generate_emergency_script') {
    return emergencyTool.execute({ args });
  }
  return 'Tool not found.';
};

const run = async (conversationMessages, userId) => {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationMessages,
  ];

  let riskLevel = 'low';
  let emergencyScript = null;

  // Agentic tool-calling loop
  for (let iteration = 0; iteration < 10; iteration++) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      tools: ALL_TOOL_DEFINITIONS,
      tool_choice: 'auto',
    });

    const choice = response.choices[0];
    messages.push(choice.message);

    if (choice.finish_reason !== 'tool_calls' || !choice.message.tool_calls) {
      // Final response — extract the text
      const finalText = choice.message.content || '';
      return { response: finalText, riskLevel, emergencyScript };
    }

    // Execute each tool call
    for (const toolCall of choice.message.tool_calls) {
      const toolName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      const result = await dispatchTool(toolName, args, userId);

      // Track risk level from assess_risk tool
      if (toolName === 'assess_risk') {
        try {
          const parsed = JSON.parse(result);
          if (parsed.level) riskLevel = parsed.level;
        } catch {
          // ignore parse error
        }
      }

      // Track emergency script
      if (toolName === 'generate_emergency_script') {
        emergencyScript = result;
      }

      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: result,
      });
    }
  }

  return {
    response: 'I\'m here for you. Please reach out to a crisis line (988) if you need immediate help.',
    riskLevel,
    emergencyScript,
  };
};

module.exports = { run };
