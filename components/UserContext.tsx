import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import type { User } from '../types';
import { useAllUsers } from './AllUsersContext';

interface UserContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  addPoints: (points: number) => void;
  toggleWishlist: (productId: number) => void;
  updateUserProfile: (data: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { users, addUser, updateUser } = useAllUsers();

  const withUserDefaults = (partial: Partial<User>): User => ({
      wishlist: [],
      facebookConnected: false,
      shirtSize: '',
      pantsSize: '',
      shoeSize: '',
      instagramHandle: '',
      tiktokHandle: '',
      pinterestHandle: '',
      youtubeChannel: '',
      ...partial,
  } as User);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('styleswap_user');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        const userExists = users.find(u => u.email === parsedUser.email);
        if (userExists) {
            setUser(withUserDefaults(userExists)); // Use the data from allUsers context to stay in sync
        } else {
            localStorage.removeItem('styleswap_user');
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('styleswap_user');
    }
  }, [users]);
  
  const syncUser = (updatedUser: User) => {
      const normalizedUser = withUserDefaults(updatedUser);
      setUser(normalizedUser);
      updateUser(normalizedUser); // Update the "master" list of users
      localStorage.setItem('styleswap_user', JSON.stringify(normalizedUser));
  };


  const login = async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (foundUser) {
          const normalized = withUserDefaults(foundUser);
          setUser(normalized);
          localStorage.setItem('styleswap_user', JSON.stringify(normalized));
          resolve();
        } else {
          reject(new Error("User not found."));
        }
      }, 500);
    });
  };

  const signup = async (name: string, email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
          reject(new Error("Email already exists."));
          return;
        }
        const newUser: User = withUserDefaults({
          name,
          email,
          points: 100, // Welcome points
          role: email === 'admin@styleswap.com' ? 'admin' : 'customer',
          registeredAt: new Date().toISOString(),
          wishlist: [],
          facebookConnected: false,
        });
        addUser(newUser);
        setUser(newUser);
        localStorage.setItem('styleswap_user', JSON.stringify(newUser));
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('styleswap_user');
  };

  const addPoints = (points: number) => {
    if (user) {
      const updatedUser = { ...user, points: user.points + points };
      syncUser(updatedUser);
    }
  };
  
  const toggleWishlist = (productId: number) => {
      if (user) {
          const newWishlist = user.wishlist.includes(productId)
            ? user.wishlist.filter(id => id !== productId)
            : [...user.wishlist, productId];
          const updatedUser = { ...user, wishlist: newWishlist };
          syncUser(updatedUser);
      }
  };
  
  const updateUserProfile = (data: Partial<User>) => {
      if(user) {
          const updatedUser = { ...user, ...data };
          syncUser(updatedUser);
      }
  };


  return (
    <UserContext.Provider value={{ user, login, signup, logout, addPoints, toggleWishlist, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};