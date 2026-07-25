import './RiskBadge.css';

const LABELS = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
  emergency: 'Emergency',
};

const RiskBadge = ({ level }) => {
  if (!level) return null;
  return <span className={`risk-badge risk-${level}`}>{LABELS[level] || level}</span>;
};

export default RiskBadge;
