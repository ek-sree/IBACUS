import { BookOpen, Home, Plus, Users } from "lucide-react";
import type { MenuItem } from "../interface/SidebarMenuItem";


export  const menuItems: MenuItem[] = [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Plus, label: "Tasks", path: "/teacher/tasks" },
    { icon: Users, label: "User Lists", path: "/teacher/user-lists" },
  ];


 export  const studentSidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: "/" },
    { id: 'tasks', label: 'All Tasks', icon: BookOpen, path: "/all-tasks" },
    // { id: 'profile', label: 'Profile', icon: User, path: "/profile" },
  ];



export const sortOptions = [
  { value: "", label: "None" },
  { value: "assignedDate_asc", label: "Assigned Date (Old → New)" },
  { value: "assignedDate_desc", label: "Assigned Date (New → Old)" },
  { value: "dueDate_asc", label: "Due Date (Old → New)" },
  { value: "dueDate_desc", label: "Due Date (New → Old)" },
];



  export   const subjectOptions = [
    { value: "mathematics", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "english", label: "English" },
    { value: "history", label: "History" },
    { value: "geography", label: "Geography" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
  ];
