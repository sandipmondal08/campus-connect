import { useAuth } from '@/context/AuthContext';
import { useComplaints } from '@/context/ComplaintContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import RoleBadge from '@/components/RoleBadge';
import { FileText, Clock, CheckCircle, AlertTriangle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  const navigate = useNavigate();

  const myComplaints = complaints.filter((c) => c.userId === user?.id);
  const pending = myComplaints.filter((c) => c.status === 'pending').length;
  const resolved = myComplaints.filter((c) => c.status === 'resolved').length;
  const inProgress = myComplaints.filter((c) => c.status === 'in-progress' || c.status === 'assigned').length;

  return (
    <DashboardLayout title="My Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <div className="gradient-hero rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-display font-bold text-primary-foreground">Welcome back, {user?.name}!</h2>
          <p className="text-primary-foreground/70 mt-1">
            {user?.role === 'student' ? 'Student' : 'Faculty'} • {user?.department}
            {user?.hostel && ` • ${user.hostel}`}
          </p>
          <Button onClick={() => navigate('/new-complaint')} className="mt-4 bg-primary-foreground/20 hover:bg-primary-foreground/30 border-0 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> New Complaint
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Complaints" value={myComplaints.length} icon={FileText} color="primary" />
          <StatsCard title="Pending" value={pending} icon={Clock} color="pending" />
          <StatsCard title="In Progress" value={inProgress} icon={AlertTriangle} color="accent" />
          <StatsCard title="Resolved" value={resolved} icon={CheckCircle} color="resolved" />
        </div>

        {/* Recent complaints */}
        <div className="bg-card rounded-xl shadow-card">
          <div className="p-4 md:p-6 border-b flex items-center justify-between">
            <h3 className="font-display font-semibold text-card-foreground">Recent Complaints</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/my-complaints')}>View All</Button>
          </div>
          <div className="divide-y">
            {myComplaints.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No complaints yet. Submit your first one!</p>
              </div>
            ) : (
              myComplaints.slice(0, 5).map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 md:px-6 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/complaint/${c.id}`)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                      <RoleBadge role={c.userRole} />
                    </div>
                    <p className="font-medium text-card-foreground truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.category} • {new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={c.status} size="sm" />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
