import { generateId, daysAgoISO } from "../utils/helpers";

// Which statuses each demo application passed through.
const PATH = {
  Applied: ["Applied"],
  Interview: ["Applied", "Interview"],
  Assessment: ["Applied", "Assessment"],
  Offer: ["Applied", "Interview", "Offer"],
  Rejected: ["Applied", "Rejected"],
};

// Dates are relative to today so charts always look alive.
export function createSampleApplications() {
  const rows = [
    ["Google", "Frontend Developer", "Bengaluru", "Full-time", 2, "Applied", "18 LPA", "Referred by a senior."],
    ["Microsoft", "Software Engineer Intern", "Hyderabad", "Internship", 4, "Interview", "50,000/month", "Technical round on Friday."],
    ["Razorpay", "React Developer", "Remote", "Full-time", 6, "Assessment", "14 LPA", "Online coding test, 90 minutes."],
    ["Swiggy", "UI Engineer", "Bengaluru", "Full-time", 9, "Rejected", "", "Rejected after resume screening."],
    ["Zoho", "Web Developer", "Chennai", "Full-time", 12, "Offer", "9 LPA", "Offer letter received. Reply by next week."],
    ["Atlassian", "Frontend Intern", "Remote", "Internship", 15, "Applied", "40,000/month", ""],
    ["Flipkart", "SDE-1 Frontend", "Bengaluru", "Full-time", 20, "Interview", "16 LPA", "Machine coding round done."],
    ["Freshworks", "Associate Software Engineer", "Chennai", "Full-time", 26, "Rejected", "8 LPA", ""],
    ["Postman", "Frontend Engineer", "Remote", "Contract", 34, "Applied", "", "Contract for 6 months."],
    ["Cred", "Web Developer", "Bengaluru", "Full-time", 41, "Assessment", "15 LPA", "Take-home assignment."],
  ];

  return rows.map(([company, title, location, type, daysAgo, status, salary, notes]) => ({
    id: generateId(),
    company,
    title,
    location,
    type,
    dateApplied: daysAgoISO(daysAgo),
    url: "",
    status,
    salary,
    notes,
    history: PATH[status].map((s, i) => ({
      status: s,
      date: daysAgoISO(Math.max(daysAgo - i * 3, 0)),
    })),
  }));
}