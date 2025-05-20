"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { schemes } from "@/data/schemes";
import { notFound } from "next/navigation";

export default function SchemeApplicationPage({
  params,
}: {
  params: { schemeId: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const scheme = schemes.find((s) => s.id === params.schemeId);

  if (!scheme) {
    notFound();
  }

  const [formData, setFormData] = useState({
    name: "",
    aadharNumber: "",
    bankAccount: "",
    landDetails: "",
    additionalInfo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully.",
    });
    router.push("/applications");
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Apply for {scheme.name}</h1>
          <p className="text-muted-foreground">{scheme.description}</p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Scheme Details</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Eligibility: </span>
                <span className="text-muted-foreground">
                  {scheme.eligibility.categories?.join(", ")}
                </span>
              </div>
              <div>
                <span className="font-medium">Benefits: </span>
                <span className="text-muted-foreground">
                  {scheme.benefits.description}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {scheme.documents.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aadharNumber">Aadhar Number</Label>
              <Input
                id="aadharNumber"
                value={formData.aadharNumber}
                onChange={(e) =>
                  setFormData({ ...formData, aadharNumber: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccount">Bank Account Number</Label>
              <Input
                id="bankAccount"
                value={formData.bankAccount}
                onChange={(e) =>
                  setFormData({ ...formData, bankAccount: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="landDetails">Land Details</Label>
              <Textarea
                id="landDetails"
                value={formData.landDetails}
                onChange={(e) =>
                  setFormData({ ...formData, landDetails: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) =>
                  setFormData({ ...formData, additionalInfo: e.target.value })
                }
              />
            </div>

            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 