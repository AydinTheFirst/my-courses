import { BookCheck, Home, Presentation, Users } from "lucide-react";

export const sidebarItems = [
  {
    canCreate: false,
    href: "/dashboard",
    icon: Home,
    label: "Yönetim Paneli",
  },
  {
    canCreate: true,
    href: "/dashboard/users",
    icon: Users,
    label: "Kullanıcılar",
  },
  {
    canCreate: true,
    href: "/dashboard/courses",
    icon: BookCheck,
    label: "Kurslar",
  },
  {
    canCreate: true,
    href: "/dashboard/lessons",
    icon: Presentation,
    label: "Dersler",
  },
];
