import { useAuth } from '@/context/AuthContext';
import { useComplaints } from '@/context/ComplaintContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import RoleBadge from '@/components/RoleBadge';
import { FileText, Clock, CheckCircle, AlertTriangle, PlusCircle, ArrowRight, Inbox } from 'lucide-react';
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
      <div className="space-y-8">
        {/* Hero welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-foreground/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-primary-foreground/5 translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-primary-foreground/60 text-sm font-medium mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-1">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-primary-foreground/70 text-sm">
              {user?.role === 'student' ? 'Student' : 'Faculty'} • {user?.department}
              {user?.hostel && ` • ${user.hostel}`}
            </p>
            <Button
              onClick={() => navigate('/new-complaint')}
              className="mt-5 bg-primary-foreground/15 hover:bg-primary-foreground/25 border border-primary-foreground/20 text-primary-foreground backdrop-blur-sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Submit New Complaint
            </Button>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Complaints" value={myComplaints.length} icon={FileText} color="primary" />
          <StatsCard title="Pending" value={pending} icon={Clock} color="pending" />
          <StatsCard title="In Progress" value={inProgress} icon={AlertTriangle} color="accent" />
          <StatsCard title="Resolved" value={resolved} icon={CheckCircle} color="resolved" />
        </div>

        {/* Recent complaints */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="p-5 md:p-6 border-b flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-card-foreground text-lg">Recent Complaints</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Your latest submitted complaints</p>
            </div>
            {myComplaints.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/my-complaints')} className="text-primary">
                View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          <div className="divide-y">
            {myComplaints.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 md:p-16 text-center"
              >
                <div className="h-16 w-16 rounded-2xl bg-muted/80 flex items-center justify-center mx-auto mb-4">
                  <Inbox className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h4 className="font-display font-semibold text-card-foreground mb-1">No complaints yet</h4>
                <p className="text-sm text-muted-foreground mb-5">Submit your first complaint to get started</p>
                <Button onClick={() => navigate('/new-complaint')} className="gradient-hero border-0">
                  <PlusCircle className="mr-2 h-4 w-4" /> Submit Complaint
                </Button>
              </motion.div>
            ) : (
              myComplaints.slice(0, 5).map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 md:px-6 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/complaint/${c.id}`)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{c.id}</span>
                      <RoleBadge role={c.userRole} />
                    </div>
                    <p className="font-medium text-card-foreground truncate group-hover:text-primary transition-colors">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">{c.category} • {new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={c.status} size="sm" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
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

export default UserDashboard;
