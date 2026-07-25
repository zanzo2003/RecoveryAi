const Session = require('../../models/Session');
const User = require('../../models/User');
const recoveryAgent = require('../../agents/recovery.agent');
const { tts } = require('../../services/openai.service');
const riskTool = require('../../tools/risk.tool');
const { chat } = require('../chat.controller');

jest.mock('../../models/Session');
jest.mock('../../models/User');
jest.mock('../../agents/recovery.agent');
jest.mock('../../services/openai.service', () => ({ tts: jest.fn() }));
jest.mock('../../tools/risk.tool', () => ({ execute: jest.fn() }));

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

const makeSession = () => ({
  _id: 's1',
  messages: [],
  riskHistory: [],
  save: jest.fn().mockResolvedValue(),
});

describe('chat.controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 400 when message is missing', async () => {
    const req = { body: { message: '  ' }, user: { id: 'u1' } };
    const res = mockRes();

    await chat(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Session.create).not.toHaveBeenCalled();
  });

  it('defaults risk level to low when the risk tool returns unparseable output', async () => {
    const session = makeSession();
    Session.create.mockResolvedValue(session);
    recoveryAgent.run.mockResolvedValue({ response: 'Hi there', emergencyScript: null });
    riskTool.execute.mockResolvedValue('not json');
    tts.mockResolvedValue('base64audio');

    const req = { body: { message: 'hello' }, user: { id: 'u1' } };
    const res = mockRes();

    await chat(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ riskLevel: 'low' }));
    expect(session.riskHistory).toEqual([{ level: 'low' }]);
    expect(User.findById).not.toHaveBeenCalled();
  });

  it('attaches emergency contacts when risk level is high', async () => {
    const session = makeSession();
    Session.create.mockResolvedValue(session);
    recoveryAgent.run.mockResolvedValue({ response: 'Please stay safe', emergencyScript: 'script' });
    riskTool.execute.mockResolvedValue(JSON.stringify({ level: 'high' }));
    tts.mockResolvedValue('base64audio');

    const contacts = [{ name: 'Mom', phone: '555', relation: 'Parent' }];
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ emergencyContacts: contacts }) });

    const req = { body: { message: 'I want to relapse' }, user: { id: 'u1' } };
    const res = mockRes();

    await chat(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ riskLevel: 'high', emergencyContacts: contacts })
    );
  });

  it('continues without audio when TTS fails', async () => {
    const session = makeSession();
    Session.create.mockResolvedValue(session);
    recoveryAgent.run.mockResolvedValue({ response: 'Hi there', emergencyScript: null });
    riskTool.execute.mockResolvedValue(JSON.stringify({ level: 'low' }));
    tts.mockRejectedValue(new Error('tts down'));

    const req = { body: { message: 'hello' }, user: { id: 'u1' } };
    const res = mockRes();

    await chat(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ audioBase64: null }));
  });
});
