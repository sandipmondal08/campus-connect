import { useComplaints } from '@/context/ComplaintContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['hsl(45, 93%, 47%)', 'hsl(221, 83%, 53%)', 'hsl(25, 95%, 53%)', 'hsl(142, 71%, 45%)', 'hsl(0, 84%, 60%)'];

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

  // Build trend from actual data grouped by date
  const dateMap = new Map<string, number>();
  complaints.forEach((c) => {
    const day = new Date(c.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
    dateMap.set(day, (dateMap.get(day) || 0) + 1);
  });
  const trendData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
    day,
    complaints: dateMap.get(day) || 0,
  }));

  const hasData = complaints.length > 0;

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total" value={complaints.length} icon={FileText} color="primary" />
          <StatsCard title="Pending" value={complaints.filter((c) => c.status === 'pending').length} icon={Clock} color="pending" />
          <StatsCard title="In Progress" value={complaints.filter((c) => c.status === 'in-progress' || c.status === 'assigned').length} icon={AlertTriangle} color="accent" />
          <StatsCard title="Resolved" value={complaints.filter((c) => c.status === 'resolved').length} icon={CheckCircle} color="resolved" />
        </div>

        {!hasData ? (
          <div className="bg-card rounded-2xl shadow-card p-16 text-center">
            <p className="font-display font-semibold text-card-foreground mb-1">No data yet</p>
            <p className="text-sm text-muted-foreground">Charts will appear once complaints are submitted</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { title: 'Status Distribution', chart: (
                <PieChart>
                  <Pie data={statusData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              )},
              { title: 'Student vs Faculty', chart: (
                <PieChart>
                  <Pie data={roleData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    <Cell fill="hsl(221, 83%, 53%)" />
                    <Cell fill="hsl(271, 81%, 56%)" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              )},
              { title: 'By Category', chart: (
                <BarChart data={catBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="complaints" fill="hsl(221, 83%, 53%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              )},
              { title: 'Weekly Trend', chart: (
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="complaints" stroke="hsl(172, 66%, 50%)" strokeWidth={3} dot={{ fill: 'hsl(172, 66%, 50%)', r: 5 }} />
                </LineChart>
              )},
            ].map((panel, i) => (
              <motion.div key={panel.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl shadow-card p-6">
                <h3 className="font-display font-bold text-card-foreground mb-4">{panel.title}</h3>
                <ResponsiveContainer width="100%" height={280}>
                  {panel.chart}
                </ResponsiveContainer>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
