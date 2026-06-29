export type UserRole = 'superadmin' | 'admin' | 'principal' | 'teacher' | 'student' | 'parent' | 'staff';

export type House = 'Red' | 'Blue' | 'Green' | 'Yellow';

export type Section = 'A' | 'B';

export type ClassLevel =
  | 'Nursery' | 'LKG' | 'UKG'
  | 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5' | 'Class 6'
  | 'Class 7' | 'Class 8' | 'Class 9' | 'Class 10';

export type ElectionPosition =
  | 'Head Boy' | 'Head Girl'
  | 'Games Captain (Boys)' | 'Games Captain (Girls)'
  | 'Red House Captain' | 'Blue House Captain' | 'Green House Captain' | 'Yellow House Captain'
  | 'Red House Vice Captain' | 'Blue House Vice Captain' | 'Green House Vice Captain' | 'Yellow House Vice Captain';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  createdBy?: string;
}

export interface StudentProfile extends UserProfile {
  role: 'student';
  admissionNumber: string;
  rollNumber: number;
  class: ClassLevel;
  section?: Section;
  house: House;
  dateOfBirth?: string;
  address?: string;
  parentId?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  parentOccupation?: string;
  bloodGroup?: string;
  gender: 'Male' | 'Female' | 'Other';
  admissionDate: string;
}

export interface TeacherProfile extends UserProfile {
  role: 'teacher';
  employeeId: string;
  qualification: string;
  subjects: string[];
  classes: ClassLevel[];
  designation: string;
  joiningDate: string;
  address?: string;
  gender: 'Male' | 'Female' | 'Other';
}

export interface StaffProfile extends UserProfile {
  role: 'staff';
  employeeId: string;
  designation: string;
  department: string;
  joiningDate: string;
  address?: string;
  gender: 'Male' | 'Female' | 'Other';
}

export interface ParentProfile extends UserProfile {
  role: 'parent';
  studentIds: string[];
  occupation?: string;
  address?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  class: ClassLevel;
  section?: Section;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: string;
  notes?: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  class: ClassLevel;
  section?: Section;
  subject: string;
  assignedBy: string;
  assignedDate: string;
  dueDate: string;
  attachments?: string[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  class: ClassLevel;
  section?: Section;
  subject: string;
  assignedBy: string;
  totalMarks: number;
  assignedDate: string;
  dueDate: string;
  attachments?: string[];
}

export interface Result {
  id: string;
  studentId: string;
  class: ClassLevel;
  section?: Section;
  examType: 'Unit Test' | 'Mid Term' | 'Final' | 'Pre-Board';
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade?: string;
  remarks?: string;
  examDate: string;
  publishedBy: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Academic' | 'Exam' | 'Event' | 'Holiday' | 'Urgent';
  publishedBy: string;
  publishedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  attachments?: string[];
  targetRoles?: UserRole[];
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageURL?: string;
  publishedBy: string;
  publishedAt: Date;
  isPublished: boolean;
  tags?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  venue: string;
  organizer: string;
  imageURL?: string;
  isPublished: boolean;
  category: 'Academic' | 'Cultural' | 'Sports' | 'Religious' | 'Other';
}

export interface GalleryImage {
  id: string;
  title: string;
  imageURL: string;
  category: string;
  uploadedBy: string;
  uploadedAt: Date;
  description?: string;
}

export interface Download {
  id: string;
  title: string;
  description?: string;
  fileURL: string;
  fileName: string;
  fileSize?: string;
  category: 'Form' | 'Syllabus' | 'Result' | 'Notice' | 'Other';
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ElectionCandidate {
  id: string;
  name: string;
  class: ClassLevel;
  section?: Section;
  house: House;
  position: ElectionPosition;
  photoURL?: string;
  manifesto?: string;
  votes: number;
  isElected: boolean;
  studentId: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
}

export interface StudentCouncilMember {
  id: string;
  name: string;
  position: ElectionPosition;
  class: ClassLevel;
  section?: Section;
  house: House;
  photoURL?: string;
  academicYear: string;
  studentId: string;
}
