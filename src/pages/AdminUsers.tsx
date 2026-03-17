import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Ban, Trash2, KeyRound, Search, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const AdminUsers = () => {
  const { allUsers, deleteUser, blockUser, resetUserPassword } = useAuth();
  const users = allUsers.filter((u) => u.role === 'student' || u.role === 'faculty');
  const [resetId, setResetId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => {
    if (!resetId || newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    resetUserPassword(resetId, newPassword);
    toast.success('Password reset successfully!');
    setOpen(false);
    setResetId(null);
    setNewPassword('');
  };

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="text-sm text-muted-foreground">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</div>
        </div>

        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="divide-y">
            {filtered.length === 0 ? (
              <div className="p-16 text-center">
                <div className="h-14 w-14 rounded-2xl bg-muted/80 flex items-center justify-center mx-auto mb-4">
                  <UserX className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <p className="font-display font-semibold text-card-foreground mb-1">No users found</p>
                <p className="text-sm text-muted-foreground">{search ? 'Try a different search' : 'No students or faculty registered yet'}</p>
              </div>
            ) : (
              filtered.map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 md:px-6 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0 text-sm">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-card-foreground">{u.name}</p>
                      {u.blocked && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-status-rejected/15 text-status-rejected">Blocked</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{u.email} • <span className="capitalize">{u.role}</span> • {u.department}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Dialog open={open && resetId === u.id} onOpenChange={(o) => { setOpen(o); if (!o) { setResetId(null); setNewPassword(''); } }}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8" onClick={() => { setResetId(u.id); setOpen(true); }}>
                          <KeyRound className="h-3.5 w-3.5 mr-1" /> Reset
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-display">Reset Password — {u.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-2">
                          <div>
                            <Label>New Password</Label>
                            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 8 characters" />
                          </div>
                          <Button className="w-full gradient-hero border-0" onClick={handleReset}>Reset Password</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="outline" className="h-8" onClick={() => { blockUser(u.id); toast.success(u.blocked ? 'User unblocked' : 'User blocked'); }}>
                      <Ban className="h-3.5 w-3.5 mr-1" /> {u.blocked ? 'Unblock' : 'Block'}
                    </Button>
                    <Button size="sm" variant="destructive" className="h-8" onClick={() => { deleteUser(u.id); toast.success('User deleted'); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
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

export default AdminUsers;
