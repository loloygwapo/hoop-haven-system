
import { Team, Player, Game, Court, Announcement, Reservation, TimeSlot } from "./types";

// Generate players for a team
function generatePlayers(teamName: string, count: number): Player[] {
  const positions = ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"];
  const players: Player[] = [];

  for (let i = 1; i <= count; i++) {
    const playerNumber = Math.floor(Math.random() * 99) + 1;
    const position = positions[Math.floor(Math.random() * positions.length)];
    const age = Math.floor(Math.random() * 10) + 18; // 18 to 27 years old
    
    players.push({
      id: `${teamName.toLowerCase().replace(/\s+/g, '-')}-player-${i}`,
      name: `Player ${i} of ${teamName}`,
      jerseyNumber: playerNumber,
      position,
      age,
      height: `${Math.floor(Math.random() * 30) + 160}cm`, // 160cm to 190cm
    });
  }

  return players;
}

// Generate teams
export const TEAMS: Team[] = [
  {
    id: "team-1",
    name: "Lightning Strikers",
    coach: "Michael Johnson",
    contactNumber: "+639123456789",
    players: generatePlayers("Lightning Strikers", 10),
    createdAt: new Date(2023, 5, 10).toISOString(),
  },
  {
    id: "team-2",
    name: "Barangay Bulldogs",
    coach: "Robert Garcia",
    contactNumber: "+639187654321",
    players: generatePlayers("Barangay Bulldogs", 10),
    createdAt: new Date(2023, 5, 12).toISOString(),
  },
  {
    id: "team-3",
    name: "City Slammers",
    coach: "David Lee",
    contactNumber: "+639123789456",
    players: generatePlayers("City Slammers", 10),
    createdAt: new Date(2023, 5, 15).toISOString(),
  },
  {
    id: "team-4",
    name: "Riverside Rockets",
    coach: "James Williams",
    contactNumber: "+639456123789",
    players: generatePlayers("Riverside Rockets", 10),
    createdAt: new Date(2023, 5, 18).toISOString(),
  },
];

// Generate courts
export const COURTS: Court[] = [
  {
    id: "court-1",
    name: "Main Barangay Court",
    address: "123 Main Street, Barangay Center",
    availableTimeSlots: generateTimeSlots("court-1", 7),
  },
  {
    id: "court-2",
    name: "Community Center Court",
    address: "456 Community Ave, Barangay East",
    availableTimeSlots: generateTimeSlots("court-2", 7),
  },
  {
    id: "court-3",
    name: "School Gymnasium",
    address: "789 Education Blvd, Barangay West",
    availableTimeSlots: generateTimeSlots("court-3", 7),
  },
];

// Generate time slots for a court
function generateTimeSlots(courtId: string, daysFromNow: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  // For each day, generate time slots
  for (let day = 0; day < daysFromNow; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    const dateString = date.toISOString().split('T')[0];
    
    // Time slots from 8 AM to 8 PM (8:00, 10:00, 13:00, 15:00, 17:00, 19:00)
    const startTimes = ["08:00", "10:00", "13:00", "15:00", "17:00", "19:00"];
    const endTimes = ["10:00", "12:00", "15:00", "17:00", "19:00", "21:00"];
    
    for (let i = 0; i < startTimes.length; i++) {
      // Randomly mark some slots as booked
      const isBooked = Math.random() > 0.7;
      
      slots.push({
        id: `${courtId}-${dateString}-${i}`,
        date: dateString,
        startTime: startTimes[i],
        endTime: endTimes[i],
        isBooked,
        bookedBy: isBooked ? "user-reservation" : undefined,
      });
    }
  }
  
  return slots;
}

// Generate games
export const GAMES: Game[] = [
  {
    id: "game-1",
    homeTeam: TEAMS[0],
    awayTeam: TEAMS[1],
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    time: "15:00",
    location: COURTS[0],
    status: "scheduled",
    round: "Group Stage",
  },
  {
    id: "game-2",
    homeTeam: TEAMS[2],
    awayTeam: TEAMS[3],
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    time: "17:00",
    location: COURTS[0],
    status: "scheduled",
    round: "Group Stage",
  },
  {
    id: "game-3",
    homeTeam: TEAMS[0],
    awayTeam: TEAMS[2],
    date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
    time: "14:00",
    location: COURTS[1],
    status: "scheduled",
    round: "Group Stage",
  },
  {
    id: "game-4",
    homeTeam: TEAMS[1],
    awayTeam: TEAMS[3],
    date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
    time: "16:00",
    location: COURTS[1],
    status: "scheduled",
    round: "Group Stage",
  },
  {
    id: "game-5",
    homeTeam: TEAMS[0],
    awayTeam: TEAMS[3],
    date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
    time: "15:00",
    location: COURTS[2],
    status: "scheduled",
    round: "Group Stage",
  },
  {
    id: "game-6",
    homeTeam: TEAMS[1],
    awayTeam: TEAMS[2],
    date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
    time: "17:00",
    location: COURTS[2],
    status: "scheduled",
    round: "Group Stage",
  },
  // Add a past game with score
  {
    id: "game-past-1",
    homeTeam: TEAMS[0],
    awayTeam: TEAMS[1],
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
    time: "15:00",
    location: COURTS[0],
    status: "completed",
    score: {
      home: 84,
      away: 78,
    },
    round: "Group Stage",
  },
  {
    id: "game-past-2",
    homeTeam: TEAMS[2],
    awayTeam: TEAMS[3],
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
    time: "17:00",
    location: COURTS[0],
    status: "completed",
    score: {
      home: 92,
      away: 88,
    },
    round: "Group Stage",
  },
];

// Generate announcements
export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Tournament Opening Ceremony",
    content: "We're excited to announce the opening ceremony for our basketball tournament this Saturday at 10 AM. All teams should arrive by 9:30 AM for the parade of teams.",
    createdBy: "admin",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    category: "important",
    isPinned: true,
  },
  {
    id: "ann-2",
    title: "Schedule Update for Week 2",
    content: "Due to expected rain, all games scheduled for next Tuesday have been moved to Wednesday at the same times. Please check the updated schedule.",
    createdBy: "admin",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    category: "schedule",
    isPinned: false,
  },
  {
    id: "ann-3",
    title: "Referee Meeting",
    content: "All referees are required to attend a meeting this Friday at 6 PM at the Main Barangay Court to discuss tournament rules and procedures.",
    createdBy: "admin",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    category: "general",
    isPinned: false,
  },
  {
    id: "ann-4",
    title: "First Round Results",
    content: "The results from the first round of games are now available. Congratulations to the Lightning Strikers and City Slammers for their wins!",
    createdBy: "admin",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    category: "results",
    isPinned: false,
  },
];

// Generate reservations
export const RESERVATIONS: Reservation[] = [
  {
    id: "res-1",
    userId: "user-1",
    userName: "John Doe",
    courtId: "court-1",
    courtName: "Main Barangay Court",
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    startTime: "13:00",
    endTime: "15:00",
    purpose: "Team practice",
    status: "approved",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
  {
    id: "res-2",
    userId: "user-2",
    userName: "Jane Smith",
    courtId: "court-2",
    courtName: "Community Center Court",
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
    startTime: "15:00",
    endTime: "17:00",
    purpose: "Basketball clinic",
    status: "approved",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: "res-3",
    userId: "user-3",
    userName: "Robert Johnson",
    courtId: "court-3",
    courtName: "School Gymnasium",
    date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
    startTime: "17:00",
    endTime: "19:00",
    purpose: "Youth training",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];
