"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowRight, Shield, Users, FileText, CheckCircle } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const handleConnectWallet = () => {
    router.push("/auth/signin");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  WelfareChain
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Revolutionizing welfare distribution through blockchain technology. 
                  Transparent, secure, and efficient delivery of government schemes to citizens.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Button
                    size="lg"
                    onClick={handleConnectWallet}
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Connect Wallet
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 md:-mr-20 lg:-mr-36" />
            <div className="shadow-lg md:rounded-3xl">
              <div className="bg-indigo-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                <div className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36" />
                <div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
                  <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                    <div className="w-screen overflow-hidden rounded-tl-xl bg-gray-900">
                      <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                        <div className="-mb-px flex text-sm font-medium leading-6 text-gray-400">
                          <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                            Dashboard
                          </div>
                        </div>
                      </div>
                      <div className="px-6 pt-6 pb-14">
                        {/* Preview of dashboard */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-24 rounded-lg bg-indigo-500/10 p-4">
                            <div className="h-2 w-24 rounded bg-indigo-500/20" />
                            <div className="mt-2 h-4 w-16 rounded bg-indigo-500/20" />
                          </div>
                          <div className="h-24 rounded-lg bg-indigo-500/10 p-4">
                            <div className="h-2 w-24 rounded bg-indigo-500/20" />
                            <div className="mt-2 h-4 w-16 rounded bg-indigo-500/20" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Faster, Secure, Transparent</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage welfare schemes
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            WelfareChain brings transparency and efficiency to welfare distribution through blockchain technology.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <dt className="mt-4 font-semibold text-gray-900">Secure & Transparent</dt>
                  <dd className="mt-2 leading-7 text-gray-600">
                    Every transaction is recorded on the blockchain, ensuring complete transparency and security.
                  </dd>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <dt className="mt-4 font-semibold text-gray-900">Citizen-Centric</dt>
                  <dd className="mt-2 leading-7 text-gray-600">
                    Easy access to welfare schemes and real-time tracking of applications and disbursements.
                  </dd>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <dt className="mt-4 font-semibold text-gray-900">Efficient Distribution</dt>
                  <dd className="mt-2 leading-7 text-gray-600">
                    Automated verification and instant disbursement of benefits to eligible citizens.
                  </dd>
                </CardContent>
              </Card>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to get started?
            <br />
            Connect your wallet today.
          </h2>
          <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
            <Button
              size="lg"
              onClick={handleConnectWallet}
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Connect Wallet
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 