// import type { AppProps } from "next/app";
// import { ThemeProvider } from "@/components/providers/theme-provider";
// import { ethers } from "ethers";

// // Create a provider instance
// let provider: ethers.providers.Web3Provider | null = null;

// // Export provider for use in other components
// export const getProvider = () => {
//   if (typeof window !== "undefined" && window.ethereum) {
//     if (!provider) {
//       provider = new ethers.providers.Web3Provider(window.ethereum);
//     }
//     return provider;
//   }
//   return null;
// };

// // Export signer for use in other components
// export const getSigner = async () => {
//   const provider = getProvider();
//   if (!provider) return null;
//   return provider.getSigner();
// };

// export default function App({ Component, pageProps }: AppProps) {
//   return (
//     <ThemeProvider
//       attribute="class"
//       defaultTheme="system"
//       enableSystem
//       disableTransitionOnChange
//     >
//       <Component {...pageProps} />
//     </ThemeProvider>
//   );
// } 


import type { AppProps } from "next/app";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Web3Provider } from "@ethersproject/providers"; // ✅ Use legacy provider
// OR
// import { BrowserProvider } from "ethers"; // ✅ Ethers v6 equivalent

let provider: Web3Provider | null = null; // ✅ If using @ethersproject/providers
// let provider: BrowserProvider | null = null; // ✅ If using Ethers v6

// Export provider for use in other components
export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    if (!provider) {
      // Ethers v6
      // provider = new BrowserProvider(window.ethereum);
      
      // OR (if using @ethersproject/providers for v5-style Web3Provider)
      provider = new Web3Provider(window.ethereum);
    }
    return provider;
  }
  return null;
};

// Export signer for use in other components
export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) return null;
  return provider.getSigner();
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
