"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SchemeSearch } from "@/components/scheme-search";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Mock data for schemes
const schemes = [
  {
    id: "1",
    name: "PM-KISAN Samman Nidhi",
    description: "Income support of ₹6,000 per year to all farmer families",
    tags: ["Agriculture", "Farmers", "Income Support"],
    category: "Agriculture",
    eligibility: ["Small and marginal farmers", "Landholding farmers"],
    benefits: ["₹6,000 per year", "Direct bank transfer", "3 equal installments"]
  },
  {
    id: "2",
    name: "Ayushman Bharat Yojana",
    description: "Health insurance coverage up to ₹5 lakhs per family per year",
    tags: ["Healthcare", "Insurance", "Medical"],
    category: "Healthcare",
    eligibility: ["Economically weaker sections", "Rural population"],
    benefits: ["Health coverage up to ₹5 lakhs", "Cashless treatment", "Pan-India coverage"]
  },
  {
    id: "3",
    name: "PM Awas Yojana (Urban)",
    description: "Housing for All in Urban Areas",
    tags: ["Housing", "Urban", "Subsidy"],
    category: "Housing",
    eligibility: ["Urban poor", "EWS/LIG categories"],
    benefits: ["Interest subsidy", "Affordable housing", "Credit-linked subsidy"]
  }
];

export default function SchemesPage() {
  const [filteredSchemes, setFilteredSchemes] = useState(schemes);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welfare Schemes</h2>
      </div>
      <SchemeSearch schemes={schemes} onSearch={setFilteredSchemes} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id}>
            <CardHeader>
              <CardTitle>{scheme.name}</CardTitle>
              <CardDescription>{scheme.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {scheme.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Eligibility:</h4>
                  <ul className="list-inside list-disc text-sm text-muted-foreground">
                    {scheme.eligibility.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Benefits:</h4>
                  <ul className="list-inside list-disc text-sm text-muted-foreground">
                    {scheme.benefits.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/schemes/apply/${scheme.id}`}>
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 