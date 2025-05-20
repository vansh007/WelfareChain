"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';

import { useWelfareChain } from '@/hooks/use-welfare-chain';
import { toast } from 'sonner';

interface AppState {
  isAdmin: boolean;
  isBeneficiary: boolean;
  userRole: 'admin' | 'beneficiary' | 'none';
  notifications: Notification[];
}

type Notification = {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: number;
};

type Action =
  | { type: 'SET_USER_ROLE'; payload: 'admin' | 'beneficiary' | 'none' }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

const initialState: AppState = {
  isAdmin: false,
  isBeneficiary: false,
  userRole: 'none',
  notifications: [],
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER_ROLE':
      return {
        ...state,
        userRole: action.payload,
        isAdmin: action.payload === 'admin',
        isBeneficiary: action.payload === 'beneficiary',
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            ...action.payload,
          },
        ],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { address } = useAccount();
  const { beneficiaries } = useWelfareChain();

  useEffect(() => {
    if (!address) {
      dispatch({ type: 'SET_USER_ROLE', payload: 'none' });
      return;
    }

    // Check if user is a beneficiary
    const isBeneficiary = beneficiaries?.some(
      (b: any) => b.address.toLowerCase() === address.toLowerCase()
    );

    // TODO: Implement admin role check
    const isAdmin = false; // This should be implemented based on your contract

    if (isAdmin) {
      dispatch({ type: 'SET_USER_ROLE', payload: 'admin' });
    } else if (isBeneficiary) {
      dispatch({ type: 'SET_USER_ROLE', payload: 'beneficiary' });
    } else {
      dispatch({ type: 'SET_USER_ROLE', payload: 'none' });
    }
  }, [address, beneficiaries]);

  // Show notifications using toast
  useEffect(() => {
    state.notifications.forEach((notification) => {
      toast[notification.type](notification.message, {
        id: notification.id,
        onDismiss: () => {
          dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
        },
      });
    });
  }, [state.notifications]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 