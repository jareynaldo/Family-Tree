// src/context/FamilyContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { familyService } from '@/services/api';

const FamilyContext = createContext();

export function FamilyProvider({ children }) {
  const { user, token, loading: authLoading } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading]   = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await familyService.getFamilyMembers(token);
      setMembers(data);
    } catch {
      setMembers([]);
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

  const addMember = async (md) => {
    const m = await familyService.addFamilyMember(md, token);
    setMembers(prev => [...prev, m]);
  };
  const updateFamilyMember = async (id, updates) => {
    const m = await familyService.updateFamilyMember(id, updates, token);
    setMembers(prev => prev.map(x => x.id === id ? m : x));
  };

  return (
    <FamilyContext.Provider
      value={{ user, token, authLoading, members, loading, refresh, addMember, updateFamilyMember }}
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
