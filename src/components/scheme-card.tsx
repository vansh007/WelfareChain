"use client";

import { Scheme } from "@/types/scheme";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, Users, Calendar, FileText, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SchemeCardProps {
  scheme: Scheme;
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{scheme.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {scheme.description}
            </CardDescription>
          </div>
          <Badge
            variant={scheme.status === "active" ? "default" : "secondary"}
            className="capitalize"
          >
            {scheme.status}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">{scheme.category}</Badge>
          {scheme.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="capitalize">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Benefits</p>
            <p className="text-sm">
              {scheme.benefits.type === "monetary" && formatAmount(scheme.benefits.amount!)}
              {scheme.benefits.type === "non-monetary" && "Non-monetary benefits"}
              {scheme.benefits.type === "both" && `${formatAmount(scheme.benefits.amount!)} + Benefits`}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Applications</p>
            <p className="text-sm">
              {scheme.statistics.approvedApplications.toLocaleString()} approved
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(scheme.timeline.startDate).toLocaleDateString()}
              {scheme.timeline.lastDateToApply && ` - ${new Date(scheme.timeline.lastDateToApply).toLocaleDateString()}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{scheme.statistics.totalApplications.toLocaleString()} applicants</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Info className="h-4 w-4" />
              Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{scheme.name}</DialogTitle>
              <DialogDescription>{scheme.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Eligibility Criteria</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {scheme.eligibility.ageRange && (
                    <li>Age: {scheme.eligibility.ageRange.min} - {scheme.eligibility.ageRange.max} years</li>
                  )}
                  {scheme.eligibility.incomeLimit && (
                    <li>Income Limit: {formatAmount(scheme.eligibility.incomeLimit)}</li>
                  )}
                  {scheme.eligibility.education && (
                    <li>Education: {scheme.eligibility.education.join(", ")}</li>
                  )}
                  {scheme.eligibility.categories && (
                    <li>Categories: {scheme.eligibility.categories.join(", ")}</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Required Documents</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {scheme.documents.map((doc) => (
                    <li key={doc}>{doc}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Application Process</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {scheme.applicationProcess.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm">
                  <p>Email: {scheme.contactInfo.email}</p>
                  <p>Phone: {scheme.contactInfo.phone}</p>
                  {scheme.contactInfo.website && (
                    <a
                      href={scheme.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button size="sm" className="gap-1">
          <FileText className="h-4 w-4" />
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
} 