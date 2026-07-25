const Journal = require('../../models/Journal');
const { openai } = require('../../services/openai.service');
const { createJournal, getJournals, getTip } = require('../journal.controller');

jest.mock('../../models/Journal');
jest.mock('../../services/openai.service', () => ({
  openai: {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  },
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('journal.controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('createJournal returns 400 when content or mood is missing', async () => {
    const req = { body: { content: '' }, user: { id: 'u1' } };
    const res = mockRes();

    await createJournal(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Content and mood are required' });
  });

  it('getJournals returns journal list', async () => {
    const journals = [{ _id: 'j1', content: 'Entry', mood: 'good' }];
    const limit = jest.fn().mockResolvedValue(journals);
    const sort = jest.fn(() => ({ limit }));
    Journal.find.mockReturnValue({ sort });

    const req = { user: { id: 'u1' } };
    const res = mockRes();

    await getJournals(req, res);

    expect(Journal.find).toHaveBeenCalledWith({ userId: 'u1' });
    expect(res.json).toHaveBeenCalledWith(journals);
  });

  it('getTip returns AI-generated tip', async () => {
    const limit = jest.fn().mockResolvedValue([
      { mood: 'struggling', content: 'Had strong cravings at night' },
    ]);
    const sort = jest.fn(() => ({ limit }));
    Journal.find.mockReturnValue({ sort });

    openai.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: 'Try a 2-minute breathing reset before bed tonight.' } }],
    });

    const req = { user: { id: 'u1' } };
    const res = mockRes();

    await getTip(req, res);

    expect(openai.chat.completions.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      tip: 'Try a 2-minute breathing reset before bed tonight.',
    });
  });
});
