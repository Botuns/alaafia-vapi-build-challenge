"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, Bell, Calendar, Settings, Home, BookOpen, AlertTriangle, Heart, Pill } from "lucide-react"

export default function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: "/dashboard/users",
      label: "Users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/dashboard/wellness",
      label: "Wellness",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      href: "/dashboard/reminders",
      label: "Reminders",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      href: "/dashboard/medications",
      label: "Medications",
      icon: <Pill className="h-5 w-5" />,
    },
    {
      href: "/dashboard/content",
      label: "Content",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      href: "/dashboard/emergency",
      label: "Emergency",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      href: "/dashboard/schedule",
      label: "Schedule",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="w-64 bg-white border-r min-h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href || pathname?.startsWith(`${item.href}/`)
                ? "bg-emerald-100 text-emerald-900"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
