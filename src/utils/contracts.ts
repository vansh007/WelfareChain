import { ethers } from "ethers";
import WelfareToken from "../../artifacts/contracts/WelfareToken.sol/WelfareToken.json";
import WelfareRegistry from "../../artifacts/contracts/WelfareRegistry.sol/WelfareRegistry.json";
import WelfareVerification from "../../artifacts/contracts/WelfareVerification.sol/WelfareVerification.json";
import WelfareAudit from "../../artifacts/contracts/WelfareAudit.sol/WelfareAudit.json";
import WelfareDistribution from "../../artifacts/contracts/WelfareDistribution.sol/WelfareDistribution.json";
import SchemeRegistry from "../../artifacts/contracts/SchemeRegistry.sol/SchemeRegistry.json";
import DocumentVerification from "../../artifacts/contracts/DocumentVerification.sol/DocumentVerification.json";

const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
};

const getSigner = () => {
  const provider = getProvider();
  return provider.getSigner();
};

export const getWelfareTokenContract = () => {
  const signer = getSigner();
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_WELFARE_TOKEN_ADDRESS!,
    WelfareToken.abi,
    signer
  );
};

export const getWelfareRegistryContract = () => {
  const signer = getSigner();
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_WELFARE_REGISTRY_ADDRESS!,
    WelfareRegistry.abi,
    signer
  );
};

export const getWelfareVerificationContract = () => {
  const signer = getSigner();
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_WELFARE_VERIFICATION_ADDRESS!,
    WelfareVerification.abi,
    signer
  );
};

export const getWelfareAuditContract = () => {
  const signer = getSigner();
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_WELFARE_AUDIT_ADDRESS!,
    WelfareAudit.abi,
    signer
  );
};

export const getWelfareDistributionContract = () => {
  const signer = getSigner();
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_WELFARE_DISTRIBUTION_ADDRESS!,
    WelfareDistribution.abi,
    signer
  );
};

export const getSchemeRegistryContract = () => {
  const signer = getSigner();
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_SCHEME_REGISTRY_ADDRESS!,
    SchemeRegistry.abi,
    signer
  );
};

export const getDocumentVerificationContract = () => {
  const signer = getSigner();
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_DOCUMENT_VERIFICATION_ADDRESS!,
    DocumentVerification.abi,
    signer
  );
}; 