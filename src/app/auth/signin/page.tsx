"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Shield, ArrowRight } from "lucide-react";
import Cookies from "js-cookie";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleSignIn = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
      if (accounts.length > 0) {
        // Store the connected address in a cookie
        Cookies.set("userAddress", accounts[0], { expires: 7 }); // Expires in 7 days
        
        toast({
          title: "Connected successfully",
          description: "You have been signed in with MetaMask",
        });

        // Redirect to the callback URL or dashboard
        router.push(callbackUrl);
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to MetaMask. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to WelfareChain
          </h1>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to access welfare schemes and manage your benefits
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-center">
              <div className="rounded-full bg-indigo-100 p-3">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <CardTitle className="text-center text-xl">
              Connect Your Wallet
            </CardTitle>
            <CardDescription className="text-center">
              We use MetaMask to securely connect your wallet and verify your identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                className="w-full"
                size="lg"
                onClick={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  "Connecting..."
                ) : (
                  <>
                    Connect with MetaMask
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                By connecting your wallet, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Why connect your wallet?</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>Secure identity verification</li>
                <li>Access to welfare schemes</li>
                <li>Track your applications</li>
                <li>Receive benefits directly</li>
              </ul>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 