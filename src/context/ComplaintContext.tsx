import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Complaint, ComplaintStatus, ComplaintCategory, Team } from '@/types';

interface ComplaintContextType {
  complaints: Complaint[];
  teams: Team[];
  addComplaint: (c: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'timeline'>) => void;
  updateStatus: (id: string, status: ComplaintStatus, note: string) => void;
  assignTeam: (complaintId: string, teamId: string) => void;
  addSolution: (id: string, solution: string, solutionImage?: string) => void;
  addTeam: (team: Omit<Team, 'id'>) => void;
  deleteTeam: (id: string) => void;
}

const INITIAL_TEAMS: Team[] = [
  { id: 'team-1', name: 'Maintenance Team', members: ['Rajesh Kumar'], categoryAssigned: 'college' },
  { id: 'team-2', name: 'IT Support Team', members: ['Priya Sharma'], categoryAssigned: 'college' },
  { id: 'team-3', name: 'Hostel Management', members: ['Suresh Patel'], categoryAssigned: 'hostel' },
];

const ComplaintContext = createContext<ComplaintContextType | null>(null);

export const useComplaints = () => {
  const ctx = useContext(ComplaintContext);
  if (!ctx) throw new Error('useComplaints must be within ComplaintProvider');
  return ctx;
};

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);

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
    setTeams((currentTeams) => {
      const team = currentTeams.find((t) => t.id === teamId);
      if (!team) return currentTeams;
      setComplaints((prev) => prev.map((c) =>
        c.id === complaintId ? {
          ...c, assignedTeamId: teamId, assignedTeamName: team.name, status: 'assigned' as ComplaintStatus,
          updatedAt: new Date().toISOString(),
          timeline: [...c.timeline, { date: new Date().toISOString(), status: 'assigned' as ComplaintStatus, note: `Assigned to ${team.name}` }],
        } : c
      ));
      return currentTeams;
    });
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

  const addTeam = useCallback((team: Omit<Team, 'id'>) => {
    setTeams((prev) => [...prev, { ...team, id: `team-${Date.now()}` }]);
  }, []);

  const deleteTeam = useCallback((id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ComplaintContext.Provider value={{ complaints, teams, addComplaint, updateStatus, assignTeam, addSolution, addTeam, deleteTeam }}>
      {children}
    </ComplaintContext.Provider>
  );
};
