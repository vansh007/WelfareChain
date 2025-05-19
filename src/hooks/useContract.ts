import { useState, useCallback } from "react";
import { ethers } from "ethers";
import {
  getWelfareTokenContract,
  getWelfareRegistryContract,
  getWelfareVerificationContract,
  getWelfareAuditContract,
  getWelfareDistributionContract,
  getSchemeRegistryContract,
  getDocumentVerificationContract,
} from "../utils/contracts";

export const useContract = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransaction = useCallback(async (tx: Promise<any>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await tx;
      await result.wait();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerBeneficiary = useCallback(
    async (address: string, data: string) => {
      const contract = getWelfareRegistryContract();
      return handleTransaction(contract.registerBeneficiary(address, data));
    },
    [handleTransaction]
  );

  const verifyBeneficiary = useCallback(
    async (address: string) => {
      const contract = getWelfareVerificationContract();
      return handleTransaction(contract.verifyBeneficiary(address));
    },
    [handleTransaction]
  );

  const distributeTokens = useCallback(
    async (address: string, amount: string) => {
      const contract = getWelfareDistributionContract();
      return handleTransaction(
        contract.distributeTokens(address, ethers.utils.parseEther(amount))
      );
    },
    [handleTransaction]
  );

  const registerScheme = useCallback(
    async (name: string, description: string, requirements: string) => {
      const contract = getSchemeRegistryContract();
      return handleTransaction(
        contract.registerScheme(name, description, requirements)
      );
    },
    [handleTransaction]
  );

  const verifyDocument = useCallback(
    async (address: string, documentHash: string) => {
      const contract = getDocumentVerificationContract();
      return handleTransaction(
        contract.verifyDocument(address, documentHash)
      );
    },
    [handleTransaction]
  );

  const logAudit = useCallback(
    async (action: string, details: string) => {
      const contract = getWelfareAuditContract();
      return handleTransaction(contract.logAudit(action, details));
    },
    [handleTransaction]
  );

  return {
    loading,
    error,
    registerBeneficiary,
    verifyBeneficiary,
    distributeTokens,
    registerScheme,
    verifyDocument,
    logAudit,
  };
}; 