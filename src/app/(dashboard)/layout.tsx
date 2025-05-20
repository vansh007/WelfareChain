"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Settings,
  BarChart3,
  FolderOpen,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Schemes",
    href: "/schemes",
    icon: FileText,
  },
  {
    name: "Applications",
    href: "/applications",
    icon: FileText,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FolderOpen,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-background p-4 transition-transform lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">WelfareChain</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="mt-8 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r">
        <div className="flex h-14 items-center border-b px-4">
          <h2 className="text-lg font-semibold">WelfareChain</h2>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-14 items-center gap-4 px-4 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
              </h1>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
} 