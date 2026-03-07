import { useComplaints } from '@/context/ComplaintContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Settings } from 'lucide-react';

const AdminTeams = () => {
  const { teams } = useComplaints();

  return (
    <DashboardLayout title="Team Management">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((t) => (
          <div key={t.id} className="bg-card rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-card-foreground">{t.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">Category: {t.categoryAssigned}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Members:</p>
              {t.members.map((m) => (
                <div key={m} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm text-card-foreground">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{m.charAt(0)}</div>
                  {m}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AdminTeams;
