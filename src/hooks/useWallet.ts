import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { getProvider, getSigner } from "@/pages/_app";

interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnecting: false,
    isConnected: false,
    error: null,
  });

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setState((prev) => ({
        ...prev,
        error: "MetaMask is not installed",
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isConnecting: true, error: null }));

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const signer = await getSigner();
      if (!signer) throw new Error("Failed to get signer");

      const address = await signer.getAddress();
      const provider = getProvider();
      if (!provider) throw new Error("Provider not available");
      
      const network = await provider.getNetwork();

      setState({
        address,
        chainId: network.chainId,
        isConnecting: false,
        isConnected: true,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : "Failed to connect wallet",
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      chainId: null,
      isConnecting: false,
      isConnected: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const provider = getProvider();
    if (!provider) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setState((prev) => ({ ...prev, address: accounts[0] }));
      }
    };

    const handleChainChanged = (chainId: string) => {
      setState((prev) => ({ ...prev, chainId: parseInt(chainId, 16) }));
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // Check if already connected
    provider.listAccounts().then((accounts) => {
      if (accounts.length > 0) {
        setState((prev) => ({
          ...prev,
          address: accounts[0],
          isConnected: true,
        }));
        provider.getNetwork().then((network) => {
          setState((prev) => ({ ...prev, chainId: network.chainId }));
        });
      }
    });

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
  };
} 