import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import api from '../services/api';
import EmergencyContactsList from './EmergencyContactsList';

vi.mock('../services/api', () => ({
  default: { delete: vi.fn() },
}));

describe('EmergencyContactsList', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows empty state with an add button when there are no contacts', () => {
    const onAddClick = vi.fn();
    render(<EmergencyContactsList contacts={[]} onContactsUpdated={vi.fn()} onAddClick={onAddClick} />);

    fireEvent.click(screen.getByText('+ Add Contact'));
    expect(onAddClick).toHaveBeenCalled();
  });

  it('does not call the delete API when the confirmation is dismissed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const contacts = [{ _id: 'c1', name: 'Mom', phone: '555', relation: 'Parent' }];

    render(<EmergencyContactsList contacts={contacts} onContactsUpdated={vi.fn()} onAddClick={vi.fn()} />);
    fireEvent.click(screen.getByTitle('Delete contact'));

    expect(window.confirm).toHaveBeenCalled();
    expect(api.delete).not.toHaveBeenCalled();
  });

  it('deletes the contact and updates the list when confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const contacts = [{ _id: 'c1', name: 'Mom', phone: '555', relation: 'Parent' }];
    const onContactsUpdated = vi.fn();
    api.delete.mockResolvedValue({ data: { contacts: [] } });

    render(<EmergencyContactsList contacts={contacts} onContactsUpdated={onContactsUpdated} onAddClick={vi.fn()} />);
    fireEvent.click(screen.getByTitle('Delete contact'));

    await waitFor(() => expect(onContactsUpdated).toHaveBeenCalledWith([]));
    expect(api.delete).toHaveBeenCalledWith('/api/emergency-contacts/c1');
  });
});
