"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/overview";
import { RecentActivity } from "@/components/recent-activity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schemes">Schemes</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Schemes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Active welfare schemes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Beneficiaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  Registered beneficiaries
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Disbursements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹45.2M</div>
                <p className="text-xs text-muted-foreground">
                  Total amount disbursed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">
                  Applications under review
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  Monthly disbursement trends
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest transactions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="schemes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheme Analytics</CardTitle>
              <CardDescription>
                Detailed analysis of welfare schemes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add scheme-specific analytics here */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="beneficiaries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Beneficiary Analytics</CardTitle>
              <CardDescription>
                Detailed analysis of beneficiary data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add beneficiary-specific analytics here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 