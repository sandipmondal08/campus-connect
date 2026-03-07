import { useAuth } from '@/context/AuthContext';
import { useComplaints } from '@/context/ComplaintContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import RoleBadge from '@/components/RoleBadge';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MyComplaints = () => {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  const navigate = useNavigate();
  const myComplaints = complaints.filter((c) => c.userId === user?.id);

  return (
    <DashboardLayout title="My Complaints">
      <div className="bg-card rounded-xl shadow-card">
        <div className="divide-y">
          {myComplaints.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No complaints found.</div>
          ) : (
            myComplaints.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="p-4 md:px-6 flex items-center justify-between hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => navigate(`/complaint/${c.id}`)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                    <RoleBadge role={c.userRole} />
                  </div>
                  <p className="font-medium text-card-foreground truncate">{c.title}</p>
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
    </DashboardLayout>
  );
};

export default MyComplaints;
