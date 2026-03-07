import { useParams, useNavigate } from 'react-router-dom';
import { useComplaints } from '@/context/ComplaintContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import RoleBadge from '@/components/RoleBadge';
import { STATUS_CONFIG } from '@/types';
import { ArrowLeft, MapPin, Calendar, User, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ComplaintDetail = () => {
  const { id } = useParams();
  const { complaints } = useComplaints();
  const navigate = useNavigate();
  const complaint = complaints.find((c) => c.id === id);

  if (!complaint) {
    return (
      <DashboardLayout title="Complaint Not Found">
        <div className="text-center py-20 text-muted-foreground">Complaint not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Complaint ${complaint.id}`}>
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="bg-card rounded-xl shadow-card p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-sm text-muted-foreground">{complaint.id}</span>
                <RoleBadge role={complaint.userRole} />
              </div>
              <h2 className="text-xl font-display font-bold text-card-foreground">{complaint.title}</h2>
            </div>
            <StatusBadge status={complaint.status} />
          </div>

          <p className="text-muted-foreground mb-6">{complaint.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Layers className="h-4 w-4" /> <span className="capitalize">{complaint.category}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {complaint.location}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" /> {complaint.userName}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" /> {new Date(complaint.createdAt).toLocaleDateString()}
            </div>
          </div>

          {complaint.assignedTeamName && (
            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
              <span className="text-muted-foreground">Assigned to: </span>
              <span className="font-medium text-card-foreground">{complaint.assignedTeamName}</span>
            </div>
          )}

          {complaint.solution && (
            <div className="mt-4 p-4 rounded-lg bg-status-resolved/10 border border-status-resolved/20">
              <p className="text-sm font-medium text-status-resolved mb-1">✅ Solution</p>
              <p className="text-sm text-card-foreground">{complaint.solution}</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-xl shadow-card p-6 md:p-8">
          <h3 className="font-display font-semibold text-card-foreground mb-6">Complaint Timeline</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {complaint.timeline.map((entry, i) => {
                const cfg = STATUS_CONFIG[entry.status];
                return (
                  <div key={i} className="relative pl-10">
                    <div className={`absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-card ${cfg.className}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <StatusBadge status={entry.status} size="sm" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-card-foreground">{entry.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplaintDetail;
