const User = require('../../models/User');
const {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
} = require('../emergency-contacts.controller');

jest.mock('../../models/User');

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('emergency-contacts.controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('addContact returns 400 when a field is missing', async () => {
    const req = { body: { name: 'Mom', phone: '' }, user: { id: 'u1' } };
    const res = mockRes();

    await addContact(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(User.findById).not.toHaveBeenCalled();
  });

  it('addContact pushes contact and returns updated list', async () => {
    const user = { emergencyContacts: [], save: jest.fn().mockResolvedValue() };
    User.findById.mockResolvedValue(user);

    const req = { body: { name: 'Mom', phone: '555', relation: 'Parent' }, user: { id: 'u1' } };
    const res = mockRes();

    await addContact(req, res);

    expect(user.emergencyContacts).toEqual([{ name: 'Mom', phone: '555', relation: 'Parent' }]);
    expect(user.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ contacts: user.emergencyContacts });
  });

  it('updateContact returns 404 when user is not found', async () => {
    User.findById.mockResolvedValue(null);

    const req = { params: { contactId: 'c1' }, body: { name: 'New' }, user: { id: 'u1' } };
    const res = mockRes();

    await updateContact(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('updateContact returns 404 when contact does not exist on the user', async () => {
    const user = { emergencyContacts: { id: jest.fn(() => null) } };
    User.findById.mockResolvedValue(user);

    const req = { params: { contactId: 'missing' }, body: { name: 'New' }, user: { id: 'u1' } };
    const res = mockRes();

    await updateContact(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Contact not found' });
  });

  it('deleteContact returns 404 when user is not found', async () => {
    User.findById.mockResolvedValue(null);

    const req = { params: { contactId: 'c1' }, user: { id: 'u1' } };
    const res = mockRes();

    await deleteContact(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('getContacts returns the user emergency contacts', async () => {
    const contacts = [{ name: 'Mom', phone: '555', relation: 'Parent' }];
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ emergencyContacts: contacts }) });

    const req = { user: { id: 'u1' } };
    const res = mockRes();

    await getContacts(req, res);

    expect(res.json).toHaveBeenCalledWith({ contacts });
  });
});
