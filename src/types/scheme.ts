export type SchemeStatus = "active" | "upcoming" | "closed";
export type SchemeCategory = "education" | "healthcare" | "housing" | "employment" | "social";

export interface SchemeBenefits {
  type: "monetary" | "non-monetary" | "both";
  amount?: number;
  description?: string;
}

export interface SchemeEligibility {
  ageRange?: {
    min: number;
    max: number;
  };
  incomeLimit?: number;
  education?: string[];
  categories?: string[];
  other?: string[];
}

export interface SchemeTimeline {
  startDate: string;
  lastDateToApply?: string;
  duration?: string;
}

export interface SchemeStatistics {
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
}

export interface SchemeContactInfo {
  email: string;
  phone: string;
  website?: string;
  address?: string;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  category: SchemeCategory;
  status: SchemeStatus;
  tags: string[];
  benefits: SchemeBenefits;
  eligibility: SchemeEligibility;
  documents: string[];
  applicationProcess: string[];
  timeline: SchemeTimeline;
  statistics: SchemeStatistics;
  contactInfo: SchemeContactInfo;
  createdAt: string;
  updatedAt: string;
} 