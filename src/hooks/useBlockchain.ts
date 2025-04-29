import { useState, useEffect } from 'react';
import { BlockchainService } from '@/lib/blockchain/blockchainService';

export function useBlockchain() {
  const [blockchainService, setBlockchainService] = useState<BlockchainService | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setBlockchainService(new BlockchainService());
    }
  }, []);

  const connectWallet = async () => {
    if (!blockchainService) {
      setError('Blockchain service not initialized');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      const address = await blockchainService.connectWallet();
      setAccount(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const createProfile = async (
    age: number,
    income: number,
    isRural: boolean,
    isBPL: boolean,
    isFarmer: boolean,
    isWoman: boolean,
    isSeniorCitizen: boolean,
    isDisabled: boolean
  ) => {
    if (!blockchainService) {
      setError('Blockchain service not initialized');
      return;
    }

    try {
      setError(null);
      await blockchainService.createProfile(
        age,
        income,
        isRural,
        isBPL,
        isFarmer,
        isWoman,
        isSeniorCitizen,
        isDisabled
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    }
  };

  const applyForScheme = async (schemeId: string) => {
    if (!blockchainService) {
      setError('Blockchain service not initialized');
      return;
    }

    try {
      setError(null);
      await blockchainService.applyForScheme(schemeId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply for scheme');
    }
  };

  const uploadDocument = async (documentHash: string) => {
    if (!blockchainService) {
      setError('Blockchain service not initialized');
      return;
    }

    try {
      setError(null);
      await blockchainService.uploadDocument(documentHash);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    }
  };

  const checkEligibility = async (schemeId: string, userAddress: string) => {
    if (!blockchainService) {
      setError('Blockchain service not initialized');
      return false;
    }

    try {
      setError(null);
      return await blockchainService.checkEligibility(schemeId, userAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check eligibility');
      return false;
    }
  };

  return {
    account,
    isConnecting,
    error,
    connectWallet,
    createProfile,
    applyForScheme,
    uploadDocument,
    checkEligibility,
  };
} 