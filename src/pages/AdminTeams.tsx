import { useState } from 'react';
import { useComplaints } from '@/context/ComplaintContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Plus, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import type { ComplaintCategory } from '@/types';

const AdminTeams = () => {
  const { teams, complaints, addTeam, deleteTeam } = useComplaints();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', member: '', category: '' as ComplaintCategory | '' });

  const handleCreate = () => {
    if (!form.name || !form.member || !form.category) {
      toast.error('Please fill all fields');
      return;
    }
    addTeam({ name: form.name, members: [form.member], categoryAssigned: form.category as ComplaintCategory });
    toast.success('Team created!');
    setForm({ name: '', member: '', category: '' });
    setOpen(false);
  };

  return (
    <DashboardLayout title="Team Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{teams.length} team{teams.length !== 1 ? 's' : ''} configured</p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-hero border-0">
                <Plus className="h-4 w-4 mr-2" /> Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label>Team Name</Label>
                  <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g., Maintenance Team" />
                </div>
                <div>
                  <Label>Team Member</Label>
                  <Input value={form.member} onChange={(e) => setForm((f) => ({ ...f, member: e.target.value }))} placeholder="Member name" />
                </div>
                <div>
                  <Label>Category Assigned</Label>
                  <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as ComplaintCategory }))}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="college">College</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                      <SelectItem value="mess-security">Mess / Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full gradient-hero border-0" onClick={handleCreate}>Create Team</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((t, i) => {
            const assignedCount = complaints.filter((c) => c.assignedTeamId === t.id).length;
            const resolvedCount = complaints.filter((c) => c.assignedTeamId === t.id && c.status === 'resolved').length;

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
              >
                <div className="gradient-hero p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center">
                      <Settings className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-primary-foreground text-sm">{t.name}</h3>
                      <p className="text-[11px] text-primary-foreground/70 capitalize">{t.categoryAssigned}</p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => { deleteTeam(t.id); toast.success('Team deleted'); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-5">
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 bg-muted/50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold font-display text-card-foreground">{assignedCount}</p>
                      <p className="text-[11px] text-muted-foreground">Assigned</p>
                    </div>
                    <div className="flex-1 bg-status-resolved/10 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold font-display text-status-resolved">{resolvedCount}</p>
                      <p className="text-[11px] text-muted-foreground">Resolved</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Members</p>
                    {t.members.map((m) => (
                      <div key={m} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-sm text-card-foreground">
                        <div className="h-6 w-6 rounded-full gradient-hero flex items-center justify-center text-[10px] font-bold text-primary-foreground">{m.charAt(0)}</div>
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminTeams;
