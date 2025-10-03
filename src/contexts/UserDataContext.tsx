import React, { createContext, useContext, useState } from 'react';

export interface UserData {
  name: string;
  phone: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UserDataContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  chatHistory: ChatMessage[];
  setChatHistory: (history: ChatMessage[]) => void;
  mealPlan: string | null;
  setMealPlan: (plan: string) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [mealPlan, setMealPlan] = useState<string | null>(null);

  return (
    <UserDataContext.Provider value={{
      userData,
      setUserData,
      chatHistory,
      setChatHistory,
      mealPlan,
      setMealPlan
    }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within UserDataProvider');
  }
  return context;
};
