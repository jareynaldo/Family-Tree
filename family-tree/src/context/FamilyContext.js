'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { familyService } from '@/services/api';

const FamilyContext = createContext();

export function FamilyProvider({ children }) {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Added cache for member lookups
  const [memberMap, setMemberMap] = useState(new Map());

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await familyService.getFamilyMembers(token);
      const validMembers = Array.isArray(data) ? data : [];
      setMembers(validMembers);
      
      // Update member lookup map
      const newMap = new Map(validMembers.map(m => [m.name, m]));
      setMemberMap(newMap);
    } catch (err) {
      console.error('Failed to load family:', err);
      setMembers([]);
      setMemberMap(new Map());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) refresh();
    else {
      setMembers([]);
      setMemberMap(new Map());
      setLoading(false);
    }
  }, [token]);

  const addMember = async (memberData) => {
    const m = await familyService.addFamilyMember(memberData, token);
    setMembers(prev => {
      const list = Array.isArray(prev) ? prev : [];
      return [...list, m];
    });
    setMemberMap(prev => new Map([...prev, [m.name, m]]));
  };

  // New helper method for tree visualization
  const getFamilyTreeData = () => {
    if (!members.length) return null;

    // Find all child references
    const childReferences = new Set();
    members.forEach(m => {
      (m.childrenNames || []).forEach(name => childReferences.add(name));
    });

    // Find root members (nodes not referenced as children)
    const roots = members.filter(m => !childReferences.has(m.name));
    
    // Recursive tree builder
    const buildNode = (member) => ({
      ...member,
      children: (member.childrenNames || [])
        .map(name => memberMap.get(name))
        .filter(Boolean)
        .map(buildNode)
    });

    return roots.map(buildNode);
  };

  return (
    <FamilyContext.Provider value={{ 
      members, 
      loading, 
      refresh, 
      addMember,
      getFamilyTreeData, // Expose tree builder
      memberMap // Expose lookup map
    }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error('useFamily must be used within FamilyProvider');
  return ctx;
}
