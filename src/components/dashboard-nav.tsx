"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  HelpCircle,
  Home,
  Building2,
  GraduationCap,
  Heart,
  Briefcase,
  UsersRound,
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Schemes",
    icon: Building2,
    href: "/schemes",
    color: "text-violet-500",
  },
  {
    label: "Applications",
    icon: FileText,
    href: "/applications",
    color: "text-pink-700",
  },
  {
    label: "Citizens",
    icon: Users,
    href: "/citizens",
    color: "text-orange-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    label: "Help",
    icon: HelpCircle,
    href: "/help",
  },
];

const categories = [
  {
    label: "All Schemes",
    icon: Home,
    href: "/schemes",
    color: "text-sky-500",
  },
  {
    label: "Education",
    icon: GraduationCap,
    href: "/schemes?category=education",
    color: "text-violet-500",
  },
  {
    label: "Healthcare",
    icon: Heart,
    href: "/schemes?category=healthcare",
    color: "text-pink-700",
  },
  {
    label: "Housing",
    icon: Building2,
    href: "/schemes?category=housing",
    color: "text-orange-700",
  },
  {
    label: "Employment",
    icon: Briefcase,
    href: "/schemes?category=employment",
    color: "text-emerald-500",
  },
  {
    label: "Social Welfare",
    icon: UsersRound,
    href: "/schemes?category=social",
    color: "text-blue-700",
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">
            WelfareChain
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
        {pathname.startsWith("/schemes") && (
          <div className="mt-8">
            <h2 className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Categories
            </h2>
            <div className="space-y-1 mt-2">
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                    pathname === category.href ? "text-white bg-white/10" : "text-zinc-400",
                  )}
                >
                  <div className="flex items-center flex-1">
                    <category.icon className={cn("h-5 w-5 mr-3", category.color)} />
                    {category.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 