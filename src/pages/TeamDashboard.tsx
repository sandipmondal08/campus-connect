import { useState } from 'react';
import { useComplaints } from '@/context/ComplaintContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import RoleBadge from '@/components/RoleBadge';
import { FileText, CheckCircle, Clock, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ComplaintStatus } from '@/types';
import { useNavigate } from 'react-router-dom';

const TeamDashboard = () => {
  const { complaints, updateStatus, addSolution } = useComplaints();
  const navigate = useNavigate();
  // For demo, show complaints assigned to team-1 (Rajesh) or all assigned
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
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Assigned" value={assigned.length} icon={FileText} color="primary" />
          <StatsCard title="Awaiting Action" value={pendingAssigned} icon={Clock} color="pending" />
          <StatsCard title="In Progress" value={inProgress} icon={Wrench} color="accent" />
          <StatsCard title="Resolved" value={resolved} icon={CheckCircle} color="resolved" />
        </div>

        <div className="bg-card rounded-xl shadow-card">
          <div className="p-4 md:p-6 border-b">
            <h3 className="font-display font-semibold text-card-foreground">Assigned Complaints</h3>
          </div>
          <div className="divide-y">
            {assigned.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No assigned complaints.</div>
            ) : (
              assigned.map((c) => (
                <div key={c.id} className="p-4 md:px-6 flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                      <RoleBadge role={c.userRole} />
                      <StatusBadge status={c.status} size="sm" />
                    </div>
                    <p className="font-medium text-card-foreground truncate cursor-pointer hover:text-primary" onClick={() => navigate(`/complaint/${c.id}`)}>{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.location} • {new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {c.status !== 'resolved' && c.status !== 'rejected' && (
                      <>
                        {c.status === 'assigned' && (
                          <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(c.id, 'in-progress')}>
                            Start Work
                          </Button>
                        )}
                        <Dialog open={open && solveId === c.id} onOpenChange={(o) => { setOpen(o); if (!o) setSolveId(null); }}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="gradient-hero border-0" onClick={() => { setSolveId(c.id); setOpen(true); }}>
                              Resolve
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="font-display">Add Solution for {c.id}</DialogTitle>
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
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeamDashboard;
