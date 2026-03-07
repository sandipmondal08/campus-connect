import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Users, Ban, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminUsers = () => {
  const { allUsers, deleteUser, blockUser } = useAuth();
  const users = allUsers.filter((u) => u.role === 'student' || u.role === 'faculty');

  return (
    <DashboardLayout title="User Management">
      <div className="bg-card rounded-xl shadow-card">
        <div className="p-4 md:p-6 border-b flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-card-foreground">All Users ({users.length})</h3>
        </div>
        <div className="divide-y">
          {users.map((u) => (
            <div key={u.id} className="p-4 md:px-6 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-card-foreground">{u.name} {u.blocked && <span className="text-status-rejected text-xs">(Blocked)</span>}</p>
                <p className="text-xs text-muted-foreground">{u.email} • {u.role} • {u.department}</p>
              </div>
              <div className="flex gap-2">
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
