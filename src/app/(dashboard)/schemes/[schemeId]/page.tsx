"use client";

import { useParams } from "next/navigation";
import { schemes } from "@/data/schemes";
import { notFound } from "next/navigation";
import { SchemeCard } from "@/components/scheme-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SchemePage() {
  const params = useParams();
  const scheme = schemes.find((s) => s.id === params.schemeId);

  if (!scheme) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-8 w-8"
          >
            <Link href="/schemes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Scheme Details</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full">
          <SchemeCard scheme={scheme} />
        </div>
      </div>
    </div>
  );
} 