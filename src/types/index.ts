export type UserRole = 'student' | 'faculty' | 'admin' | 'team';

export type ComplaintStatus = 'pending' | 'assigned' | 'in-progress' | 'resolved' | 'rejected';

export type ComplaintCategory = 'college' | 'hostel' | 'mess-security';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  hostel?: string;
  blocked?: boolean;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'faculty';
  title: string;
  description: string;
  category: ComplaintCategory;
  subcategory: string;
  location: string;
  imageUrl?: string;
  status: ComplaintStatus;
  solution?: string;
  solutionImage?: string;
  assignedTeamId?: string;
  assignedTeamName?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
}

export interface TimelineEntry {
  date: string;
  status: ComplaintStatus;
  note: string;
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  categoryAssigned: ComplaintCategory;
}

export const SUBCATEGORIES: Record<ComplaintCategory, string[]> = {
  college: [
    'Classroom problems (broken benches, fans, lights)',
    'Laboratory equipment not working',
    'Library issues (lack of books, computers)',
    'Internet/WiFi connectivity problems',
    'Electricity problems in classrooms',
    'Cleanliness of classrooms and washrooms',
  ],
  hostel: [
    'Water supply problems',
    'Electricity issues in rooms',
    'Room maintenance (broken beds, doors, windows)',
    'Bathroom and drainage problems',
    'Hostel WiFi problems',
    'Garbage and cleanliness issues',
  ],
  'mess-security': [
    'Poor food quality in mess',
    'Unhygienic kitchen',
    'Unauthorized hostel entry',
    'CCTV or security guard issues',
    'Gate timing problems in hostel',
  ],
};

export const STATUS_CONFIG: Record<ComplaintStatus, { label: string; emoji: string; className: string }> = {
  pending: { label: 'Pending', emoji: '🟡', className: 'status-pending' },
  assigned: { label: 'Assigned', emoji: '🔵', className: 'status-assigned' },
  'in-progress': { label: 'In Progress', emoji: '🟠', className: 'status-in-progress' },
  resolved: { label: 'Resolved', emoji: '🟢', className: 'status-resolved' },
  rejected: { label: 'Rejected', emoji: '🔴', className: 'status-rejected' },
};
