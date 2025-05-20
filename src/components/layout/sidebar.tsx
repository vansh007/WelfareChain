"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  FileText,
  Settings,
  BarChart2,
} from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Beneficiaries", path: "/beneficiaries" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: BarChart2, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] border-r bg-background">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 