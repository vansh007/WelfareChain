"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
  {
    id: 1,
    type: "application",
    user: "John Doe",
    action: "applied for",
    scheme: "Food Security Scheme",
    timestamp: "2 minutes ago",
    avatar: "/avatars/01.png",
  },
  {
    id: 2,
    type: "disbursement",
    user: "Jane Smith",
    action: "received disbursement from",
    scheme: "Healthcare Scheme",
    timestamp: "1 hour ago",
    avatar: "/avatars/02.png",
  },
  {
    id: 3,
    type: "verification",
    user: "Mike Johnson",
    action: "verified documents for",
    scheme: "Education Scheme",
    timestamp: "3 hours ago",
    avatar: "/avatars/03.png",
  },
  {
    id: 4,
    type: "application",
    user: "Sarah Wilson",
    action: "applied for",
    scheme: "Housing Scheme",
    timestamp: "5 hours ago",
    avatar: "/avatars/04.png",
  },
  {
    id: 5,
    type: "disbursement",
    user: "David Brown",
    action: "received disbursement from",
    scheme: "Food Security Scheme",
    timestamp: "1 day ago",
    avatar: "/avatars/05.png",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.avatar} alt={activity.user} />
            <AvatarFallback>
              {activity.user
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user}
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.action} {activity.scheme}
            </p>
          </div>
          <div className="ml-auto font-medium text-sm text-muted-foreground">
            {activity.timestamp}
          </div>
        </div>
      ))}
    </div>
  );
} 