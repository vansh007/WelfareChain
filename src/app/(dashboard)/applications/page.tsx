"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for applications
const applications = [
  {
    id: "1",
    schemeName: "PM-KISAN Samman Nidhi",
    status: "pending",
    submittedDate: "2024-02-15",
    lastUpdated: "2024-02-15",
  },
  {
    id: "2",
    schemeName: "Ayushman Bharat Yojana",
    status: "approved",
    submittedDate: "2024-02-10",
    lastUpdated: "2024-02-12",
  },
  {
    id: "3",
    schemeName: "PM Awas Yojana (Urban)",
    status: "rejected",
    submittedDate: "2024-02-05",
    lastUpdated: "2024-02-08",
  },
];

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApplications = applications.filter((app) =>
    app.schemeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-yellow-500/10 text-yellow-500";
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button>New Application</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scheme Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted Date</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.schemeName}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(app.status)}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(app.submittedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(app.lastUpdated).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 