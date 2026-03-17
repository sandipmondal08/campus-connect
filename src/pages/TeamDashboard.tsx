import { useState } from 'react';
import { useComplaints } from '@/context/ComplaintContext';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import RoleBadge from '@/components/RoleBadge';
import { FileText, CheckCircle, Clock, Wrench, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ComplaintStatus } from '@/types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TeamDashboard = () => {
  const { user } = useAuth();
  const { complaints, updateStatus, addSolution } = useComplaints();
  const navigate = useNavigate();

  const assigned = complaints.filter((c) => c.assignedTeamId);
  const inProgress = assigned.filter((c) => c.status === 'in-progress').length;
  const resolved = assigned.filter((c) => c.status === 'resolved').length;
  const pendingAssigned = assigned.filter((c) => c.status === 'assigned').length;

  const [solveId, setSolveId] = useState<string | null>(null);
  const [solution, setSolution] = useState('');
  const [open, setOpen] = useState(false);

  const handleSolve = () => {
    if (!solveId || !solution.trim()) return;
    addSolution(solveId, solution);
    toast.success('Complaint resolved!');
    setSolveId(null);
    setSolution('');
    setOpen(false);
  };

  const handleStatusUpdate = (id: string, status: ComplaintStatus) => {
    updateStatus(id, status, `Status updated to ${status}`);
    toast.success('Status updated!');
  };

  return (
    <DashboardLayout title="Team Dashboard">
      <div className="space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl gradient-hero p-8"
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary-foreground/5 -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-primary-foreground/60 text-sm font-medium mb-1">Team Member</p>
            <h2 className="text-2xl font-display font-bold text-primary-foreground">Welcome, {user?.name}!</h2>
            <p className="text-primary-foreground/70 text-sm mt-1">{user?.department}</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Assigned" value={assigned.length} icon={FileText} color="primary" />
          <StatsCard title="Awaiting Action" value={pendingAssigned} icon={Clock} color="pending" />
          <StatsCard title="In Progress" value={inProgress} icon={Wrench} color="accent" />
          <StatsCard title="Resolved" value={resolved} icon={CheckCircle} color="resolved" />
        </div>

        {/* Assigned list */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="p-5 md:p-6 border-b">
            <h3 className="font-display font-bold text-card-foreground text-lg">Assigned Complaints</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{assigned.length} complaint{assigned.length !== 1 ? 's' : ''} assigned to your team</p>
          </div>
          <div className="divide-y">
            {assigned.length === 0 ? (
              <div className="p-16 text-center">
                <div className="h-14 w-14 rounded-2xl bg-muted/80 flex items-center justify-center mx-auto mb-4">
                  <Inbox className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <p className="font-display font-semibold text-card-foreground mb-1">No assigned complaints</p>
                <p className="text-sm text-muted-foreground">Complaints assigned to your team will appear here</p>
              </div>
            ) : (
              assigned.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 md:px-6 flex flex-col md:flex-row md:items-center gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{c.id}</span>
                      <RoleBadge role={c.userRole} />
                      <StatusBadge status={c.status} size="sm" />
                    </div>
                    <p className="font-medium text-card-foreground truncate cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/complaint/${c.id}`)}>{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.location} • {new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {c.status !== 'resolved' && c.status !== 'rejected' && (
                      <>
                        {c.status === 'assigned' && (
                          <Button size="sm" variant="outline" className="h-8" onClick={() => handleStatusUpdate(c.id, 'in-progress')}>
                            Start Work
                          </Button>
                        )}
                        <Dialog open={open && solveId === c.id} onOpenChange={(o) => { setOpen(o); if (!o) setSolveId(null); }}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="h-8 gradient-hero border-0" onClick={() => { setSolveId(c.id); setOpen(true); }}>
                              Resolve
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="font-display">Add Solution — {c.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-2">
                              <div>
                                <Label>Solution Description</Label>
                                <Textarea value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="Describe the solution applied..." rows={4} />
                              </div>
                              <Button className="w-full gradient-hero border-0" onClick={handleSolve}>Mark as Resolved</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
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

export default TeamDashboard;
