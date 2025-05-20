"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SchemeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Scheme Details</h2>
      </div>
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Something went wrong!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {error.message || "An error occurred while loading the scheme details."}
          </p>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => reset()}
            >
              Try again
            </Button>
            <Button
              variant="outline"
              asChild
            >
              <Link href="/schemes">
                Back to schemes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 