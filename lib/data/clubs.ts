export type Club = {
  id: string;
  name: string;
  description: string;
  department: string;
  logo: string;
  coverImage: string;
  establishedYear: number;
  socialLinks: {
    website?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  contactEmail?: string;
  faculty?: {
    name: string;
    designation: string;
    email?: string;
    phone?: string;
  }[];
  leaders?: {
    name: string;
    position: string;
    email: string;
    phone?: string;
    imageUrl?: string;
  }[];
  achievements?: string[];
  upcomingEvents?: string[]; // IDs of upcoming events
  pastEvents?: string[]; // IDs of past events
};

export const clubs: Club[] = [
  {
    id: "1",
    name: "Robotics Club",
    description:
      "A platform for students to explore robotics technologies and participate in competitions. Our members work on various projects from basic line-following robots to advanced autonomous systems.",
    department: "Electrical Engineering",
    logo: "/clubs/robotics-logo.png",
    coverImage: "/clubs/robotics-cover.jpg",
    establishedYear: 2015,
    socialLinks: {
      website: "https://roboticsclub.espektro.org",
      instagram: "roboticsclub_espektro",
      linkedin: "roboticsclub-espektro",
    },
    contactEmail: "robotics@espektro.org",
    faculty: [
      {
        name: "Dr. Amit Kumar",
        designation: "Associate Professor",
        email: "amitkumar@espektro.org",
        phone: "9876543210",
      },
    ],
    leaders: [
      {
        name: "Rahul Sharma",
        position: "President",
        email: "rahul.sharma@espektro.org",
        phone: "9876543211",
        imageUrl: "/members/rahul.jpg",
      },
      {
        name: "Priya Singh",
        position: "Vice President",
        email: "priya.singh@espektro.org",
        imageUrl: "/members/priya.jpg",
      },
    ],
    achievements: [
      "Winner - Inter-College Robotics Challenge 2024",
      "2nd Place - National Robotics Olympiad 2023",
      "Best Innovation Award - Tech Expo 2023",
    ],
    upcomingEvents: ["1"],
    pastEvents: ["3"],
  },
  {
    id: "2",
    name: "Coding Club",
    description:
      "A community of programmers who collaborate on projects, organize hackathons, and conduct workshops to improve coding skills among students.",
    department: "Computer Science",
    logo: "/clubs/coding-logo.png",
    coverImage: "/clubs/coding-cover.jpg",
    establishedYear: 2016,
    socialLinks: {
      website: "https://codingclub.espektro.org",
      instagram: "codingclub_espektro",
      github: "codingclub-espektro",
    },
    contactEmail: "coding@espektro.org",
    faculty: [
      {
        name: "Prof. Sunil Verma",
        designation: "Assistant Professor",
        email: "sunilverma@espektro.org",
      },
    ],
    leaders: [
      {
        name: "Vikram Rajput",
        position: "Chairperson",
        email: "vikram.rajput@espektro.org",
        phone: "9876543212",
        imageUrl: "/members/vikram.jpg",
      },
      {
        name: "Neha Gupta",
        position: "Secretary",
        email: "neha.gupta@espektro.org",
        imageUrl: "/members/neha.jpg",
      },
    ],
    achievements: [
      "Organizers of Annual College Hackathon",
      "3rd Place in ACM-ICPC Regional Finals",
      "Published open-source project with 1000+ stars on GitHub",
    ],
    upcomingEvents: ["2", "5"],
    pastEvents: ["6"],
  },
  {
    id: "3",
    name: "Cultural Society",
    description:
      "The Cultural Society brings together students who are passionate about performing arts, including music, dance, drama, and literary activities.",
    department: "Student Affairs",
    logo: "/clubs/cultural-logo.png",
    coverImage: "/clubs/cultural-cover.jpg",
    establishedYear: 2010,
    socialLinks: {
      instagram: "culturalsociety_espektro",
      facebook: "EspektroCulturalSociety",
    },
    contactEmail: "cultural@espektro.org",
    faculty: [
      {
        name: "Dr. Meera Sharma",
        designation: "Professor",
        email: "meerasharma@espektro.org",
        phone: "9876543213",
      },
    ],
    leaders: [
      {
        name: "Riya Kapoor",
        position: "Cultural Secretary",
        email: "riya.kapoor@espektro.org",
        phone: "9876543214",
        imageUrl: "/members/riya.jpg",
      },
      {
        name: "Karan Malhotra",
        position: "Joint Secretary",
        email: "karan.malhotra@espektro.org",
        imageUrl: "/members/karan.jpg",
      },
    ],
    achievements: [
      "Best College Cultural Team Award 2024",
      "Winners of Inter-College Dance Competition 2023",
      "Hosts of Annual Cultural Festival with 5000+ attendees",
    ],
    upcomingEvents: ["4"],
    pastEvents: ["7"],
  },
];
