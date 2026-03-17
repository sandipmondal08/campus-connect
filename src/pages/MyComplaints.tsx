import { useAuth } from '@/context/AuthContext';
import { useComplaints } from '@/context/ComplaintContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import RoleBadge from '@/components/RoleBadge';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Inbox, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

const MyComplaints = () => {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const myComplaints = complaints
    .filter((c) => c.userId === user?.id)
    .filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout title="My Complaints">
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="divide-y">
            {myComplaints.length === 0 ? (
              <div className="p-16 text-center">
                <div className="h-14 w-14 rounded-2xl bg-muted/80 flex items-center justify-center mx-auto mb-4">
                  <Inbox className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <p className="font-display font-semibold text-card-foreground mb-1">No complaints found</p>
                <p className="text-sm text-muted-foreground">{search ? 'Try a different search term' : 'Submit your first complaint to see it here'}</p>
              </div>
            ) : (
              myComplaints.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 md:px-6 flex items-center justify-between hover:bg-muted/30 cursor-pointer transition-colors group"
                  onClick={() => navigate(`/complaint/${c.id}`)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{c.id}</span>
                      <RoleBadge role={c.userRole} />
                    </div>
                    <p className="font-medium text-card-foreground truncate group-hover:text-primary transition-colors">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">{c.category} • {c.subcategory}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={c.status} size="sm" />
                    <span className="text-[10px] text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyComplaints;
