import { useState } from 'react';
import { useComplaints } from '@/context/ComplaintContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import RoleBadge from '@/components/RoleBadge';
import { FileText, Clock, CheckCircle, XCircle, Inbox, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['hsl(45, 93%, 47%)', 'hsl(221, 83%, 53%)', 'hsl(25, 95%, 53%)', 'hsl(142, 71%, 45%)', 'hsl(0, 84%, 60%)'];

const AdminDashboard = () => {
  const { complaints, teams, assignTeam } = useComplaints();
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ status: 'all', category: 'all', role: 'all' });

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'pending').length;
  const resolved = complaints.filter((c) => c.status === 'resolved').length;
  const rejected = complaints.filter((c) => c.status === 'rejected').length;

  const statusData = [
    { name: 'Pending', value: complaints.filter((c) => c.status === 'pending').length },
    { name: 'Assigned', value: complaints.filter((c) => c.status === 'assigned').length },
    { name: 'In Progress', value: complaints.filter((c) => c.status === 'in-progress').length },
    { name: 'Resolved', value: complaints.filter((c) => c.status === 'resolved').length },
    { name: 'Rejected', value: complaints.filter((c) => c.status === 'rejected').length },
  ];

  const categoryData = [
    { name: 'College', student: complaints.filter((c) => c.category === 'college' && c.userRole === 'student').length, faculty: complaints.filter((c) => c.category === 'college' && c.userRole === 'faculty').length },
    { name: 'Hostel', student: complaints.filter((c) => c.category === 'hostel' && c.userRole === 'student').length, faculty: complaints.filter((c) => c.category === 'hostel' && c.userRole === 'faculty').length },
    { name: 'Mess/Security', student: complaints.filter((c) => c.category === 'mess-security' && c.userRole === 'student').length, faculty: complaints.filter((c) => c.category === 'mess-security' && c.userRole === 'faculty').length },
  ];

  const filtered = complaints.filter((c) => {
    if (filter.status !== 'all' && c.status !== filter.status) return false;
    if (filter.category !== 'all' && c.category !== filter.category) return false;
    if (filter.role !== 'all' && c.userRole !== filter.role) return false;
    return true;
  });

  const handleAssign = (complaintId: string, teamId: string) => {
    assignTeam(complaintId, teamId);
    toast.success('Team assigned successfully!');
  };

  const hasData = total > 0;

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Complaints" value={total} icon={FileText} color="primary" />
          <StatsCard title="Pending" value={pending} icon={Clock} color="pending" />
          <StatsCard title="Resolved" value={resolved} icon={CheckCircle} color="resolved" />
          <StatsCard title="Rejected" value={rejected} icon={XCircle} color="rejected" />
        </div>

        {/* Charts */}
        {hasData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-card p-6">
              <h3 className="font-display font-bold text-card-foreground mb-4">Status Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl shadow-card p-6">
              <h3 className="font-display font-bold text-card-foreground mb-4">Category Breakdown</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="student" name="Students" fill="hsl(221, 83%, 53%)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="faculty" name="Faculty" fill="hsl(271, 81%, 56%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {/* Complaints list */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="p-5 md:p-6 border-b">
            <div className="flex flex-wrap items-center gap-3">
              <div className="mr-auto">
                <h3 className="font-display font-bold text-card-foreground text-lg">All Complaints</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} complaint{filtered.length !== 1 ? 's' : ''}</p>
              </div>
              <Select value={filter.status} onValueChange={(v) => setFilter((f) => ({ ...f, status: v }))}>
                <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filter.category} onValueChange={(v) => setFilter((f) => ({ ...f, category: v }))}>
                <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="hostel">Hostel</SelectItem>
                  <SelectItem value="mess-security">Mess/Security</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filter.role} onValueChange={(v) => setFilter((f) => ({ ...f, role: v }))}>
                <SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="divide-y">
            {filtered.length === 0 ? (
              <div className="p-16 text-center">
                <div className="h-14 w-14 rounded-2xl bg-muted/80 flex items-center justify-center mx-auto mb-4">
                  <Inbox className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <p className="font-display font-semibold text-card-foreground mb-1">No complaints found</p>
                <p className="text-sm text-muted-foreground">
                  {total === 0 ? 'No complaints have been submitted yet' : 'Adjust your filters to see results'}
                </p>
              </div>
            ) : (
              filtered.map((c) => (
                <div key={c.id} className="p-4 md:px-6 flex items-center gap-4 hover:bg-muted/30 transition-colors group">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{c.id}</span>
                      <RoleBadge role={c.userRole} />
                      <StatusBadge status={c.status} size="sm" />
                    </div>
                    <p className="font-medium text-card-foreground truncate cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/complaint/${c.id}`)}>{c.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{c.userName} • {c.category} • {new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  {c.status === 'pending' && (
                    <Select onValueChange={(teamId) => handleAssign(c.id, teamId)}>
                      <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Assign team" /></SelectTrigger>
                      <SelectContent>
                        {teams.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
