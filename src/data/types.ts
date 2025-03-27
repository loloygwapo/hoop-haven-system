
// Types for the Basketball Tournament System

export interface Team {
  id: string;
  name: string;
  coach: string;
  contactNumber: string;
  logo?: string;
  players: Player[];
  createdAt: string;
}

export interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  position: string;
  age: number;
  height?: string;
  photo?: string;
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  location: Court;
  score?: {
    home: number;
    away: number;
  };
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  round: string;
}

export interface Court {
  id: string;
  name: string;
  address: string;
  image?: string;
  availableTimeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedBy?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  courtId: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  category: 'general' | 'schedule' | 'results' | 'important';
  isPinned: boolean;
}
