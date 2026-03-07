import { ComplaintStatus, STATUS_CONFIG } from '@/types';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md';
}

const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`${config.className} ${sizeClasses} rounded-full font-medium inline-flex items-center gap-1`}>
      <span>{config.emoji}</span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
