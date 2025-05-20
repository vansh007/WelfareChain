import dynamic from 'next/dynamic';

// Dynamically import heavy components
export const DynamicChat = dynamic(() => import('../components/Chat'), {
  loading: () => <div>Loading chat...</div>,
  ssr: false
});

export const DynamicDashboard = dynamic(() => import('../components/Dashboard'), {
  loading: () => <div>Loading dashboard...</div>
});

export const DynamicBeneficiaryForm = dynamic(
  () => import('../components/BeneficiaryForm'),
  {
    loading: () => <div>Loading form...</div>
  }
);

export const DynamicSchemeForm = dynamic(
  () => import('../components/SchemeForm'),
  {
    loading: () => <div>Loading scheme form...</div>
  }
);

// Dynamically import heavy libraries
export const DynamicEthers = dynamic(
  () => import('ethers').then((mod) => mod.ethers),
  { ssr: false }
);
