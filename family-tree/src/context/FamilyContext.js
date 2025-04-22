'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { familyService } from '@/services/api';

const FamilyContext = createContext();

export function FamilyProvider({ children }) {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await familyService.getFamilyMembers(token);
      setMembers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) refresh();
    else {
      setMembers([]);
      setLoading(false);
    }
  }, [token]);

  const addMember = async (memberData) => {
    const m = await familyService.addFamilyMember(memberData, token);
    setMembers(prev => [...prev, m]);
  };

  const updateFamilyMember = async (id, memberData) => {
    const updated = await familyService.updateFamilyMember(id, memberData, token);
    setMembers(prev =>
      prev.map(m => (m.id === id ? updated : m))
    );
  };

  const deleteFamilyMember = async (id) => {
    await familyService.deleteFamilyMember(id, token);
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <FamilyContext.Provider
      value={{
        members,
        loading,
        refresh,
        addMember,
       updateFamilyMember,
       deleteFamilyMember,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error('useFamily must be used within FamilyProvider');
  return ctx;
}
