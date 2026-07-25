import { render, screen } from '@testing-library/react';
import RiskBadge from './RiskBadge';

describe('RiskBadge', () => {
  it('renders nothing when level is missing', () => {
    const { container } = render(<RiskBadge />);
    expect(container.firstChild).toBeNull();
  });

  it('renders human-readable label for known levels', () => {
    render(<RiskBadge level="high" />);
    expect(screen.getByText('High Risk')).toBeInTheDocument();
  });

  it('falls back to raw level for unknown values', () => {
    render(<RiskBadge level="custom" />);
    expect(screen.getByText('custom')).toBeInTheDocument();
  });
});
