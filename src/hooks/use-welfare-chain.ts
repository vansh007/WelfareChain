
import { contractConfig } from '@/components/providers/web3-provider';

export function useWelfareChain() {
  // Read functions
  const { data: schemes, isLoading: isLoadingSchemes } = useContractRead({
    ...contractConfig,
    functionName: 'getAllSchemes',
  });

  const { data: beneficiaries, isLoading: isLoadingBeneficiaries } = useContractRead({
    ...contractConfig,
    functionName: 'getAllBeneficiaries',
  });

  // Write functions
  const { write: addScheme, data: addSchemeData } = useContractWrite({
    ...contractConfig,
    functionName: 'addScheme',
  });

  const { write: addBeneficiary, data: addBeneficiaryData } = useContractWrite({
    ...contractConfig,
    functionName: 'addBeneficiary',
  });

  const { write: applyForScheme, data: applyForSchemeData } = useContractWrite({
    ...contractConfig,
    functionName: 'applyForScheme',
  });

  const { write: approveApplication, data: approveApplicationData } = useContractWrite({
    ...contractConfig,
    functionName: 'approveApplication',
  });

  // Transaction status hooks
  const { isLoading: isAddingScheme } = useWaitForTransaction({
    hash: addSchemeData?.hash,
  });

  const { isLoading: isAddingBeneficiary } = useWaitForTransaction({
    hash: addBeneficiaryData?.hash,
  });

  const { isLoading: isApplyingForScheme } = useWaitForTransaction({
    hash: applyForSchemeData?.hash,
  });

  const { isLoading: isApprovingApplication } = useWaitForTransaction({
    hash: approveApplicationData?.hash,
  });

  // Helper functions
  const addNewScheme = async (
    name: string,
    description: string,
    budget: string,
    maxBeneficiaries: number
  ) => {
    try {
      await addScheme({
        args: [name, description, parseEther(budget), maxBeneficiaries],
      });
    } catch (error) {
      console.error('Error adding scheme:', error);
      throw error;
    }
  };

  const addNewBeneficiary = async (
    address: `0x${string}`,
    name: string,
    id: string
  ) => {
    try {
      await addBeneficiary({
        args: [address, name, id],
      });
    } catch (error) {
      console.error('Error adding beneficiary:', error);
      throw error;
    }
  };

  const applyToScheme = async (schemeId: number) => {
    try {
      await applyForScheme({
        args: [schemeId],
      });
    } catch (error) {
      console.error('Error applying to scheme:', error);
      throw error;
    }
  };

  const approveBeneficiaryApplication = async (
    beneficiaryAddress: `0x${string}`,
    schemeId: number
  ) => {
    try {
      await approveApplication({
        args: [beneficiaryAddress, schemeId],
      });
    } catch (error) {
      console.error('Error approving application:', error);
      throw error;
    }
  };

  return {
    // Data
    schemes,
    beneficiaries,
    
    // Loading states
    isLoadingSchemes,
    isLoadingBeneficiaries,
    isAddingScheme,
    isAddingBeneficiary,
    isApplyingForScheme,
    isApprovingApplication,
    
    // Actions
    addNewScheme,
    addNewBeneficiary,
    applyToScheme,
    approveBeneficiaryApplication,
  };
} 