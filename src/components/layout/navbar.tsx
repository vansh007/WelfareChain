"use client";

import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="font-bold text-xl">
          WelfareChain
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <Button variant="outline" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={connect}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
} 