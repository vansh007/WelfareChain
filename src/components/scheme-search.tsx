"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Scheme {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: string;
  eligibility: string[];
  benefits: string[];
}

interface SchemeSearchProps {
  schemes: Scheme[];
  onSearch: (filteredSchemes: Scheme[]) => void;
}

export function SchemeSearch({ schemes, onSearch }: SchemeSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Get unique tags from all schemes
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    schemes.forEach(scheme => {
      scheme.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [schemes]);

  // Get unique categories from all schemes
  const categories = useMemo(() => {
    const cats = new Set<string>();
    schemes.forEach(scheme => cats.add(scheme.category));
    return Array.from(cats);
  }, [schemes]);

  // Filter schemes based on search query, tags, and category
  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => scheme.tags.includes(tag));
      
      const matchesCategory = !selectedCategory ||
        scheme.category === selectedCategory;

      return matchesSearch && matchesTags && matchesCategory;
    });
  }, [schemes, searchQuery, selectedTags, selectedCategory]);

  // Update parent component with filtered schemes
  useMemo(() => {
    onSearch(filteredSchemes);
  }, [filteredSchemes, onSearch]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedCategory("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schemes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={clearFilters}
          className="shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className={cn(
              "cursor-pointer hover:bg-primary/80",
              selectedTags.includes(tag) && "bg-primary text-primary-foreground"
            )}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={cn(
              "cursor-pointer hover:bg-primary/80",
              selectedCategory === category && "bg-primary text-primary-foreground"
            )}
            onClick={() => setSelectedCategory(
              selectedCategory === category ? "" : category
            )}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
} 