import { useComplaints } from '@/context/ComplaintContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

const COLORS = ['#eab308', '#3b82f6', '#f97316', '#22c55e', '#ef4444'];

const AdminAnalytics = () => {
  const { complaints } = useComplaints();

  const statusData = [
    { name: 'Pending', value: complaints.filter((c) => c.status === 'pending').length },
    { name: 'Assigned', value: complaints.filter((c) => c.status === 'assigned').length },
    { name: 'In Progress', value: complaints.filter((c) => c.status === 'in-progress').length },
    { name: 'Resolved', value: complaints.filter((c) => c.status === 'resolved').length },
    { name: 'Rejected', value: complaints.filter((c) => c.status === 'rejected').length },
  ];

  const roleData = [
    { name: 'Students', value: complaints.filter((c) => c.userRole === 'student').length },
    { name: 'Faculty', value: complaints.filter((c) => c.userRole === 'faculty').length },
  ];

  const catBarData = [
    { name: 'College', complaints: complaints.filter((c) => c.category === 'college').length },
    { name: 'Hostel', complaints: complaints.filter((c) => c.category === 'hostel').length },
    { name: 'Mess/Security', complaints: complaints.filter((c) => c.category === 'mess-security').length },
  ];

  // fake trend data
  const trendData = [
    { day: 'Mon', complaints: 3 },
    { day: 'Tue', complaints: 5 },
    { day: 'Wed', complaints: 2 },
    { day: 'Thu', complaints: 7 },
    { day: 'Fri', complaints: 4 },
    { day: 'Sat', complaints: 1 },
    { day: 'Sun', complaints: 2 },
  ];

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total" value={complaints.length} icon={FileText} color="primary" />
          <StatsCard title="Pending" value={complaints.filter((c) => c.status === 'pending').length} icon={Clock} color="pending" />
          <StatsCard title="In Progress" value={complaints.filter((c) => c.status === 'in-progress' || c.status === 'assigned').length} icon={AlertTriangle} color="accent" />
          <StatsCard title="Resolved" value={complaints.filter((c) => c.status === 'resolved').length} icon={CheckCircle} color="resolved" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-card p-6">
            <h3 className="font-display font-semibold text-card-foreground mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl shadow-card p-6">
            <h3 className="font-display font-semibold text-card-foreground mb-4">Student vs Faculty</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={roleData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  <Cell fill="hsl(221, 83%, 53%)" />
                  <Cell fill="hsl(271, 81%, 56%)" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl shadow-card p-6">
            <h3 className="font-display font-semibold text-card-foreground mb-4">By Category</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={catBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="complaints" fill="hsl(221, 83%, 53%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl shadow-card p-6">
            <h3 className="font-display font-semibold text-card-foreground mb-4">Weekly Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="complaints" stroke="hsl(172, 66%, 50%)" strokeWidth={3} dot={{ fill: 'hsl(172, 66%, 50%)', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
