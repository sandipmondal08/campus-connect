import { useParams, useNavigate } from 'react-router-dom';
import { useComplaints } from '@/context/ComplaintContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import RoleBadge from '@/components/RoleBadge';
import { STATUS_CONFIG } from '@/types';
import { ArrowLeft, MapPin, Calendar, User, Layers, Paperclip, ImageIcon } from 'lucide-react';
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

        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {/* Header strip */}
          <div className="gradient-hero px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-primary-foreground/80 bg-primary-foreground/10 px-2 py-0.5 rounded">{complaint.id}</span>
              <RoleBadge role={complaint.userRole} />
            </div>
            <StatusBadge status={complaint.status} />
          </div>

          <div className="p-6 md:p-8">
            <h2 className="text-xl font-display font-bold text-card-foreground mb-3">{complaint.title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{complaint.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Layers, label: 'Category', value: complaint.category },
                { icon: MapPin, label: 'Location', value: complaint.location },
                { icon: User, label: 'Submitted by', value: complaint.userName },
                { icon: Calendar, label: 'Date', value: new Date(complaint.createdAt).toLocaleDateString() },
              ].map((item) => (
                <div key={item.label} className="bg-muted/40 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <item.icon className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-medium uppercase tracking-wider">{item.label}</span>
                  </div>
                  <p className="text-sm font-medium text-card-foreground capitalize truncate">{item.value}</p>
                </div>
              ))}
            </div>

            {complaint.imageUrl && (
              <div className="mt-5 p-3 border rounded-xl flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">Attachment</p>
                  <p className="text-xs text-muted-foreground truncate">Uploaded file</p>
                </div>
              </div>
            )}

            {complaint.assignedTeamName && (
              <div className="mt-5 p-4 rounded-xl bg-status-assigned/10 border border-status-assigned/20">
                <p className="text-xs font-medium text-status-assigned uppercase tracking-wider mb-1">Assigned Team</p>
                <p className="text-sm font-semibold text-card-foreground">{complaint.assignedTeamName}</p>
              </div>
            )}

            {complaint.solution && (
              <div className="mt-4 p-4 rounded-xl bg-status-resolved/10 border border-status-resolved/20">
                <p className="text-xs font-medium text-status-resolved uppercase tracking-wider mb-1">✅ Solution</p>
                <p className="text-sm text-card-foreground">{complaint.solution}</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
          <h3 className="font-display font-bold text-card-foreground mb-6">Complaint Timeline</h3>
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />
            <div className="space-y-6">
              {complaint.timeline.map((entry, i) => {
                const cfg = STATUS_CONFIG[entry.status];
                return (
                  <div key={i} className="relative pl-10">
                    <div className={`absolute left-[9px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-card ${cfg.className}`} />
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
