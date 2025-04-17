export type Event = {
  id: string;
  name: string;
  description: string;
  hostedBy: string;
  location: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  entryFee: number;
  coordinators: {
    name: string;
    phone: string;
  }[];
};

export const events: Event[] = [
  {
    id: "1",
    name: "Hackathon 2025",
    description: "A 24-hour coding competition to solve real-world problems",
    hostedBy: "Computer Science Department",
    location: "Main Auditorium",
    thumbnail: "/events/hackathon.jpg",
    startDate: "2025-04-20T09:00:00",
    endDate: "2025-04-21T09:00:00",
    entryFee: 0,
    coordinators: [
      { name: "Rahul Sharma", phone: "9876543210" },
      { name: "Priya Singh", phone: "9876543211" }
    ]
  },
  {
    id: "2",
    name: "Robotics Workshop",
    description: "Learn to build and program robots from experts",
    hostedBy: "Robotics Club",
    location: "Electronics Lab",
    thumbnail: "/events/robotics.jpg",
    startDate: "2025-04-21T10:00:00",
    endDate: "2025-04-21T16:00:00",
    entryFee: 0,
    coordinators: [
      { name: "Arjun Kumar", phone: "9876543212" },
      { name: "Sneha Patel", phone: "9876543213" }
    ]
  },
  {
    id: "3",
    name: "Tech Talks",
    description: "Industry experts share insights on emerging technologies",
    hostedBy: "Placement Cell",
    location: "Seminar Hall",
    thumbnail: "/events/techtalks.jpg",
    startDate: "2025-04-22T11:00:00",
    endDate: "2025-04-22T17:00:00",
    entryFee: 0,
    coordinators: [
      { name: "Vikram Rajput", phone: "9876543214" },
      { name: "Neha Gupta", phone: "9876543215" }
    ]
  },
  {
    id: "4",
    name: "Cultural Night",
    description: "An evening of music, dance and performances",
    hostedBy: "Cultural Committee",
    location: "Open Air Theatre",
    thumbnail: "/events/cultural.jpg",
    startDate: "2025-04-22T18:00:00",
    endDate: "2025-04-22T22:00:00",
    entryFee: 0,
    coordinators: [
      { name: "Riya Kapoor", phone: "9876543216" },
      { name: "Karan Malhotra", phone: "9876543217" }
    ]
  },
  {
    id: "5",
    name: "Gaming Tournament",
    description: "Compete in popular multiplayer games to win exciting prizes",
    hostedBy: "Gaming Club",
    location: "Computer Center",
    thumbnail: "/events/gaming.jpg",
    startDate: "2025-04-23T10:00:00",
    endDate: "2025-04-23T20:00:00",
    entryFee: 0,
    coordinators: [
      { name: "Amit Verma", phone: "9876543218" },
      { name: "Preeti Sharma", phone: "9876543219" }
    ]
  },
  {
    id: "6",
    name: "Project Exhibition",
    description: "Showcase of innovative student projects from all departments",
    hostedBy: "Innovation Cell",
    location: "College Grounds",
    thumbnail: "/events/exhibition.jpg",
    startDate: "2025-04-24T09:00:00",
    endDate: "2025-04-24T17:00:00",
    entryFee: 0,
    coordinators: [
      { name: "Deepak Patel", phone: "9876543220" },
      { name: "Anjali Desai", phone: "9876543221" }
    ]
  }
];