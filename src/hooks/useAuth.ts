import { useState, useEffect } from 'react';
import { User } from '../types/user';

/**
 * Custom hook for managing user authentication and state
 * Handles login, registration, logout, and user data persistence using localStorage
 * 
 * @returns {Object} Authentication state and methods
 * @returns {User | null} user - Current authenticated user or null
 * @returns {boolean} isLoading - Loading state during authentication checks
 * @returns {Function} login - Function to authenticate user
 * @returns {Function} register - Function to register new user
 * @returns {Function} logout - Function to logout current user
 * @returns {Function} updateUser - Function to update user data
 * @returns {Function} saveConfig - Function to save user configuration
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Effect to check for existing user session on component mount
   * Retrieves user data from localStorage if available
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('jobsy-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  /**
   * Authenticates user with email and password
   * Creates a mock user with basic gamification data
   * In a real application, this would authenticate with a backend service
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<User>} Promise that resolves to the authenticated user
   */
  const login = async (email: string, password: string) => {
    // Mock login - in real app would authenticate with backend
    const mockUser: User = {
      id: '1',
      fullName: 'Usuario Demo',
      email,
      level: 1,
      totalXP: 0,
      badges: [],
      weeklyMissions: []
    };
    
    localStorage.setItem('jobsy-user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  /**
   * Registers a new user with provided information
   * Creates a new user with initial gamification settings
   * In a real application, this would create an account via backend API
   * 
   * @param {string} fullName - User's full name
   * @param {string} email - User's email address  
   * @param {string} password - User's password
   * @returns {Promise<User>} Promise that resolves to the newly created user
   */
  const register = async (fullName: string, email: string, password: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      fullName,
      email,
      level: 1,
      totalXP: 0,
      badges: [],
      weeklyMissions: []
    };
    
    localStorage.setItem('jobsy-user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  /**
   * Logs out the current user
   * Removes user data from localStorage and clears state
   */
  const logout = () => {
    localStorage.removeItem('jobsy-user');
    setUser(null);
  };

  /**
   * Updates user data with provided changes
   * Merges updates with existing user data and persists to localStorage
   * 
   * @param {Partial<User>} updates - Object containing user data updates
   */
  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('jobsy-user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const saveConfig = async (workExperience: string, targetSector: string, targetRole: string) => {
    if (!user) {
      alert('No hay usuario autenticado');
      return false;
    }

    try {
      const res = await fetch(`${API_URL}/api/user/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email,
          workExperience, 
          targetSector, 
          targetRole 
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.message || 'Error al guardar configuración');
        return false;
      }

      const data = await res.json();
      
      // Actualizar usuario con la nueva configuración
      const updatedUser = {
        ...user,
        workExperience,
        targetSector,
        targetRole,
        configCompleted: true,
      };
      
      localStorage.setItem('jobsy-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      alert('Configuración guardada exitosamente');
      return true;
    } catch {
      alert('No se pudo conectar con el servidor.');
      return false;
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    saveConfig
  };
}