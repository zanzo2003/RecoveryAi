import { fireEvent, render, screen } from '@testing-library/react';
import ChatSidebar from './ChatSidebar';

describe('ChatSidebar', () => {
  it('shows empty state when there are no sessions', () => {
    render(<ChatSidebar sessions={[]} activeSessionId={null} onSelect={vi.fn()} onNewChat={vi.fn()} />);
    expect(screen.getByText('No previous conversations')).toBeInTheDocument();
  });

  it('labels each session as "Talked on {date}" and marks the active one', () => {
    const sessions = [
      { id: 's1', createdAt: '2026-07-20T10:00:00Z' },
      { id: 's2', createdAt: '2026-07-25T10:00:00Z' },
    ];
    render(<ChatSidebar sessions={sessions} activeSessionId="s2" onSelect={vi.fn()} onNewChat={vi.fn()} />);

    const items = screen.getAllByRole('button').filter((b) => b.textContent.startsWith('Talked on'));
    expect(items).toHaveLength(2);
    expect(items[1]).toHaveClass('active');
  });

  it('calls onSelect with the session id when clicked', () => {
    const onSelect = vi.fn();
    const sessions = [{ id: 's1', createdAt: '2026-07-20T10:00:00Z' }];
    render(<ChatSidebar sessions={sessions} activeSessionId={null} onSelect={onSelect} onNewChat={vi.fn()} />);

    fireEvent.click(screen.getByText(/Talked on/));
    expect(onSelect).toHaveBeenCalledWith('s1');
  });

  it('calls onNewChat when the new chat button is clicked', () => {
    const onNewChat = vi.fn();
    render(<ChatSidebar sessions={[]} activeSessionId={null} onSelect={vi.fn()} onNewChat={onNewChat} />);

    fireEvent.click(screen.getByText('+ New Chat'));
    expect(onNewChat).toHaveBeenCalled();
  });
});
