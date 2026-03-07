import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Ban, Trash2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

const AdminUsers = () => {
  const { allUsers, deleteUser, blockUser, resetUserPassword } = useAuth();
  const users = allUsers.filter((u) => u.role === 'student' || u.role === 'faculty');
  const [resetId, setResetId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [open, setOpen] = useState(false);

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
      <div className="bg-card rounded-xl shadow-card">
        <div className="p-4 md:p-6 border-b flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-card-foreground">All Users ({users.length})</h3>
        </div>
        <div className="divide-y">
          {users.map((u) => (
            <div key={u.id} className="p-4 md:px-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-card-foreground">{u.name} {u.blocked && <span className="text-status-rejected text-xs">(Blocked)</span>}</p>
                <p className="text-xs text-muted-foreground">{u.email} • {u.role} • {u.department}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Dialog open={open && resetId === u.id} onOpenChange={(o) => { setOpen(o); if (!o) { setResetId(null); setNewPassword(''); } }}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => { setResetId(u.id); setOpen(true); }}>
                      <KeyRound className="h-3.5 w-3.5 mr-1" /> Reset Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-display">Reset Password for {u.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                      <div>
                        <Label>New Password</Label>
                        <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password (min 8 chars)" />
                      </div>
                      <Button className="w-full gradient-hero border-0" onClick={handleReset}>Reset Password</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="outline" onClick={() => { blockUser(u.id); toast.success(u.blocked ? 'User unblocked' : 'User blocked'); }}>
                  <Ban className="h-3.5 w-3.5 mr-1" /> {u.blocked ? 'Unblock' : 'Block'}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => { deleteUser(u.id); toast.success('User deleted'); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
