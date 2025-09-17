import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import type { User } from '../types';

interface AllUsersContextType {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (email: string) => void;
}

const AllUsersContext = createContext<AllUsersContextType | undefined>(undefined);

const initialUsers: User[] = [
    { name: 'Admin User', email: 'admin@styleswap.com', points: 1000, role: 'admin', registeredAt: new Date('2024-01-01').toISOString(), wishlist: [101, 107], facebookConnected: true, shirtSize: 'M', pantsSize: 'L', shoeSize: '42' },
    { name: 'Test Customer', email: 'customer@styleswap.com', points: 250, role: 'customer', registeredAt: new Date('2024-02-15').toISOString(), wishlist: [105], facebookConnected: false, shirtSize: 'S', pantsSize: 'M', shoeSize: '38' },
];

export const AllUsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem('styleswap_all_users');
      if (storedUsers) {
          const parsed = JSON.parse(storedUsers);
          // Simple migration for users created before new fields
          return parsed.map((u: Partial<User>) => ({
              wishlist: [],
              facebookConnected: false,
              shirtSize: '',
              pantsSize: '',
              shoeSize: '',
              ...u
          }));
      }
      return initialUsers;
    } catch (error) {
      console.error("Failed to load users from localStorage", error);
      return initialUsers;
    }
  });

  useEffect(() => {
    localStorage.setItem('styleswap_all_users', JSON.stringify(users));
  }, [users]);

  const addUser = (user: User) => {
    setUsers(prevUsers => {
        if (prevUsers.some(u => u.email === user.email)) {
            return prevUsers;
        }
        return [...prevUsers, user];
    });
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(user => (user.email === updatedUser.email ? updatedUser : user)));
  };

  const deleteUser = (email: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.email !== email));
  };
  
  return (
    <AllUsersContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </AllUsersContext.Provider>
  );
};

export const useAllUsers = (): AllUsersContextType => {
  const context = useContext(AllUsersContext);
  if (context === undefined) {
    throw new Error('useAllUsers must be used within an AllUsersProvider');
  }
  return context;
};