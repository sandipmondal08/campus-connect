import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

const StatsCard = ({ title, value, icon: Icon, trend, color = 'primary' }: StatsCardProps) => {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    pending: 'bg-status-pending/15 text-status-pending',
    resolved: 'bg-status-resolved/15 text-status-resolved',
    rejected: 'bg-status-rejected/15 text-status-rejected',
    accent: 'bg-accent/15 text-accent',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`${colorMap[color] || colorMap.primary} p-2.5 rounded-xl transition-transform group-hover:scale-110`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-muted-foreground">{trend}</span>
        )}
      </div>
      <p className="text-3xl font-extrabold font-display text-card-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1 font-medium">{title}</p>
    </motion.div>
  );
};

export default StatsCard;
