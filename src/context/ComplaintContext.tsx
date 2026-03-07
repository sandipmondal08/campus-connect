import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Complaint, ComplaintStatus, ComplaintCategory, Team } from '@/types';

interface ComplaintContextType {
  complaints: Complaint[];
  teams: Team[];
  addComplaint: (c: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'timeline'>) => void;
  updateStatus: (id: string, status: ComplaintStatus, note: string) => void;
  assignTeam: (complaintId: string, teamId: string) => void;
  addSolution: (id: string, solution: string, solutionImage?: string) => void;
}

const MOCK_TEAMS: Team[] = [
  { id: 'team-1', name: 'Maintenance Team', members: ['Rajesh Kumar'], categoryAssigned: 'college' },
  { id: 'team-2', name: 'IT Support Team', members: ['Priya Sharma'], categoryAssigned: 'college' },
  { id: 'team-3', name: 'Hostel Management', members: ['Suresh Patel'], categoryAssigned: 'hostel' },
];

const now = new Date();
const d = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-001', userId: 'user-1', userName: 'Amit Singh', userRole: 'student',
    title: 'Broken fan in Classroom 201', description: 'The ceiling fan in classroom 201 is not working since last week. It makes the room very hot.',
    category: 'college', subcategory: 'Classroom problems (broken benches, fans, lights)',
    location: 'Building A, Room 201', status: 'in-progress', assignedTeamId: 'team-1', assignedTeamName: 'Maintenance Team',
    createdAt: d(5), updatedAt: d(2),
    timeline: [
      { date: d(5), status: 'pending', note: 'Complaint submitted' },
      { date: d(4), status: 'assigned', note: 'Assigned to Maintenance Team' },
      { date: d(2), status: 'in-progress', note: 'Technician dispatched' },
    ],
  },
  {
    id: 'CMP-002', userId: 'user-2', userName: 'Dr. Meena Gupta', userRole: 'faculty',
    title: 'WiFi not working in Electronics Lab', description: 'The WiFi connectivity in Electronics Lab has been extremely poor for the past 3 days.',
    category: 'college', subcategory: 'Internet/WiFi connectivity problems',
    location: 'Electronics Department, Lab 3', status: 'assigned', assignedTeamId: 'team-2', assignedTeamName: 'IT Support Team',
    createdAt: d(3), updatedAt: d(1),
    timeline: [
      { date: d(3), status: 'pending', note: 'Complaint submitted' },
      { date: d(1), status: 'assigned', note: 'Assigned to IT Support Team' },
    ],
  },
  {
    id: 'CMP-003', userId: 'user-3', userName: 'Riya Verma', userRole: 'student',
    title: 'Water supply issue in Hostel Block B', description: 'No water supply on the 3rd floor of Block B since morning.',
    category: 'hostel', subcategory: 'Water supply problems',
    location: 'Hostel Block B, 3rd Floor', status: 'resolved', assignedTeamId: 'team-3', assignedTeamName: 'Hostel Management',
    solution: 'Fixed water pump motor and restored supply to all floors.',
    createdAt: d(7), updatedAt: d(1),
    timeline: [
      { date: d(7), status: 'pending', note: 'Complaint submitted' },
      { date: d(6), status: 'assigned', note: 'Assigned to Hostel Management' },
      { date: d(4), status: 'in-progress', note: 'Plumber dispatched' },
      { date: d(1), status: 'resolved', note: 'Water pump motor replaced' },
    ],
  },
  {
    id: 'CMP-004', userId: 'user-1', userName: 'Amit Singh', userRole: 'student',
    title: 'Poor food quality in mess', description: 'The food served in the hostel mess has been of very poor quality this week.',
    category: 'mess-security', subcategory: 'Poor food quality in mess',
    location: 'Hostel Mess Hall', status: 'pending',
    createdAt: d(1), updatedAt: d(1),
    timeline: [{ date: d(1), status: 'pending', note: 'Complaint submitted' }],
  },
  {
    id: 'CMP-005', userId: 'user-2', userName: 'Dr. Meena Gupta', userRole: 'faculty',
    title: 'Unclean washrooms near Staff Room', description: 'The washrooms near the staff room on the ground floor are not being cleaned regularly.',
    category: 'college', subcategory: 'Cleanliness of classrooms and washrooms',
    location: 'Main Building, Ground Floor', status: 'rejected',
    createdAt: d(10), updatedAt: d(8),
    timeline: [
      { date: d(10), status: 'pending', note: 'Complaint submitted' },
      { date: d(8), status: 'rejected', note: 'Duplicate complaint. Already addressed in CMP-099.' },
    ],
  },
];

const ComplaintContext = createContext<ComplaintContextType | null>(null);

export const useComplaints = () => {
  const ctx = useContext(ComplaintContext);
  if (!ctx) throw new Error('useComplaints must be within ComplaintProvider');
  return ctx;
};

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);

  const addComplaint = useCallback((c: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'timeline'>) => {
    const now = new Date().toISOString();
    const newComplaint: Complaint = {
      ...c,
      id: `CMP-${String(Date.now()).slice(-4)}`,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      timeline: [{ date: now, status: 'pending', note: 'Complaint submitted' }],
    };
    setComplaints((prev) => [newComplaint, ...prev]);
  }, []);

  const updateStatus = useCallback((id: string, status: ComplaintStatus, note: string) => {
    setComplaints((prev) => prev.map((c) =>
      c.id === id ? {
        ...c, status, updatedAt: new Date().toISOString(),
        timeline: [...c.timeline, { date: new Date().toISOString(), status, note }],
      } : c
    ));
  }, []);

  const assignTeam = useCallback((complaintId: string, teamId: string) => {
    const team = MOCK_TEAMS.find((t) => t.id === teamId);
    if (!team) return;
    setComplaints((prev) => prev.map((c) =>
      c.id === complaintId ? {
        ...c, assignedTeamId: teamId, assignedTeamName: team.name, status: 'assigned' as ComplaintStatus,
        updatedAt: new Date().toISOString(),
        timeline: [...c.timeline, { date: new Date().toISOString(), status: 'assigned' as ComplaintStatus, note: `Assigned to ${team.name}` }],
      } : c
    ));
  }, []);

  const addSolution = useCallback((id: string, solution: string, solutionImage?: string) => {
    setComplaints((prev) => prev.map((c) =>
      c.id === id ? {
        ...c, solution, solutionImage, status: 'resolved' as ComplaintStatus,
        updatedAt: new Date().toISOString(),
        timeline: [...c.timeline, { date: new Date().toISOString(), status: 'resolved' as ComplaintStatus, note: solution }],
      } : c
    ));
  }, []);

  return (
    <ComplaintContext.Provider value={{ complaints, teams: MOCK_TEAMS, addComplaint, updateStatus, assignTeam, addSolution }}>
      {children}
    </ComplaintContext.Provider>
  );
};
