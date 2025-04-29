import { ethers } from 'ethers';
import {
  SCHEME_REGISTRY_ABI,
  DOCUMENT_VERIFICATION_ABI,
  ELIGIBILITY_VERIFICATION_ABI,
  CONTRACT_ADDRESSES
} from './contracts';

export class BlockchainService {
  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;
  private schemeRegistry: ethers.Contract;
  private documentVerification: ethers.Contract;
  private eligibilityVerification: ethers.Contract;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      
      this.schemeRegistry = new ethers.Contract(
        CONTRACT_ADDRESSES.schemeRegistry,
        SCHEME_REGISTRY_ABI,
        this.signer
      );

      this.documentVerification = new ethers.Contract(
        CONTRACT_ADDRESSES.documentVerification,
        DOCUMENT_VERIFICATION_ABI,
        this.signer
      );

      this.eligibilityVerification = new ethers.Contract(
        CONTRACT_ADDRESSES.eligibilityVerification,
        ELIGIBILITY_VERIFICATION_ABI,
        this.signer
      );
    }
  }

  // Connect wallet
  async connectWallet(): Promise<string> {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = await this.signer.getAddress();
      return address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  // Scheme Registry Functions
  async registerMinistry(name: string): Promise<void> {
    try {
      const tx = await this.schemeRegistry.registerMinistry(name);
      await tx.wait();
    } catch (error) {
      console.error('Error registering ministry:', error);
      throw error;
    }
  }

  async createScheme(name: string, description: string, maxBeneficiaries: number): Promise<void> {
    try {
      const tx = await this.schemeRegistry.createScheme(name, description, maxBeneficiaries);
      await tx.wait();
    } catch (error) {
      console.error('Error creating scheme:', error);
      throw error;
    }
  }

  async applyForScheme(schemeId: string): Promise<void> {
    try {
      const tx = await this.schemeRegistry.applyForScheme(schemeId);
      await tx.wait();
    } catch (error) {
      console.error('Error applying for scheme:', error);
      throw error;
    }
  }

  // Document Verification Functions
  async uploadDocument(documentHash: string): Promise<void> {
    try {
      const tx = await this.documentVerification.uploadDocument(documentHash);
      await tx.wait();
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async verifyDocument(documentHash: string): Promise<void> {
    try {
      const tx = await this.documentVerification.verifyDocument(documentHash);
      await tx.wait();
    } catch (error) {
      console.error('Error verifying document:', error);
      throw error;
    }
  }

  // Eligibility Verification Functions
  async createProfile(
    age: number,
    income: number,
    isRural: boolean,
    isBPL: boolean,
    isFarmer: boolean,
    isWoman: boolean,
    isSeniorCitizen: boolean,
    isDisabled: boolean
  ): Promise<void> {
    try {
      const tx = await this.eligibilityVerification.createProfile(
        age,
        income,
        isRural,
        isBPL,
        isFarmer,
        isWoman,
        isSeniorCitizen,
        isDisabled
      );
      await tx.wait();
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  async checkEligibility(schemeId: string, userAddress: string): Promise<boolean> {
    try {
      return await this.eligibilityVerification.checkEligibility(schemeId, userAddress);
    } catch (error) {
      console.error('Error checking eligibility:', error);
      throw error;
    }
  }

  // View Functions
  async getSchemeDetails(schemeId: string) {
    try {
      return await this.schemeRegistry.getSchemeDetails(schemeId);
    } catch (error) {
      console.error('Error getting scheme details:', error);
      throw error;
    }
  }

  async getUserApplications(userAddress: string) {
    try {
      return await this.schemeRegistry.getUserApplications(userAddress);
    } catch (error) {
      console.error('Error getting user applications:', error);
      throw error;
    }
  }

  async getProfile(userAddress: string) {
    try {
      return await this.eligibilityVerification.getProfile(userAddress);
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }
} 