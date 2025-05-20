import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export default function SchemeNotFound() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Scheme Details</h2>
      </div>
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Building2 className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Scheme not found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The scheme you are looking for does not exist or has been removed.
          </p>
          <Button
            asChild
            className="mt-4"
          >
            <Link href="/schemes">
              View all schemes
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 