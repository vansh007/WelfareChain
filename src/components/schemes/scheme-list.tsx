"use client";

import { useWelfareChain } from "@/hooks/use-welfare-chain";
import { SchemeCard } from "./scheme-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";

export function SchemeList() {
  const { schemes, isLoadingSchemes } = useWelfareChain();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "budget" | "beneficiaries">("name");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");

  const filteredAndSortedSchemes = useMemo(() => {
    if (!schemes) return [];

    let filtered = [...schemes];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (scheme) =>
          scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by active status
    if (filterActive !== "all") {
      filtered = filtered.filter(
        (scheme) => scheme.isActive === (filterActive === "active")
      );
    }

    // Sort schemes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "budget":
          return Number(b.budget - a.budget);
        case "beneficiaries":
          return b.maxBeneficiaries - a.maxBeneficiaries;
        default:
          return 0;
      }
    });

    return filtered;
  }, [schemes, searchQuery, sortBy, filterActive]);

  if (isLoadingSchemes) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search schemes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="beneficiaries">Max Beneficiaries</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterActive}
            onValueChange={(value: any) => setFilterActive(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schemes</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedSchemes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No schemes found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedSchemes.map((scheme, index) => (
            <SchemeCard key={index} scheme={scheme} schemeId={index} />
          ))}
        </div>
      )}
    </div>
  );
} 