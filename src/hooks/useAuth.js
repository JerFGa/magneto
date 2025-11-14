import { useState, useEffect } from 'react';
// URL del backend y defaults para evitar undefined.map en el dashboard
const API_URL = 'http://localhost:3001';
const DEFAULT_USER_FIELDS = {
    badges: [],
    weeklyMissions: [],
    experience: 0,
    level: 1,
    streak: 0,
    applicationsCount: 0,
    interviewsCount: 0,
    offersCount: 0
};
const normalizeUser = (rawUser) => {
    const safeUser = rawUser || {};
    return {
        ...DEFAULT_USER_FIELDS,
        ...safeUser,
        id: String(safeUser.id ?? safeUser.email ?? Date.now()),
        badges: safeUser.badges ?? DEFAULT_USER_FIELDS.badges,
        weeklyMissions: safeUser.weeklyMissions ?? DEFAULT_USER_FIELDS.weeklyMissions,
        isAdmin: Boolean(safeUser.isAdmin),
    };
};
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
 */
export function useAuth() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    /**
     * Effect to check for existing user session on component mount
     * Retrieves user data from localStorage if available
     */
    useEffect(() => {
        const savedUser = localStorage.getItem('jobsy-user');
        if (savedUser) {
            setUser(normalizeUser(JSON.parse(savedUser)));
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
    const login = async (email, password) => {
        try {
            console.log('Intentando conectar con:', `${API_URL}/api/login`);
            const res = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            console.log('Respuesta del servidor:', res.status);
            if (!res.ok) {
                const data = await res.json().catch(() => ({ message: 'Error al iniciar sesión' }));
                alert(data.message);
                return null;
            }
            const data = await res.json();
            console.log('Usuario recibido:', data);
            const normalized = normalizeUser(data.user);
            localStorage.setItem('jobsy-user', JSON.stringify(normalized));
            setUser(normalized);
            return normalized;
        }
        catch (error) {
            console.error('Error de conexión:', error);
            alert('No se pudo conectar con el servidor. Verifica que esté corriendo en http://localhost:3001');
            return null;
        }
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
    const register = async (fullName, email, password) => {
        try {
            const res = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({ message: 'Error al registrar' }));
                alert(data.message);
                return null;
            }
            const data = await res.json();
            const normalized = normalizeUser(data.user);
            localStorage.setItem('jobsy-user', JSON.stringify(normalized));
            setUser(normalized);
            return normalized;
        }
        catch {
            alert('No se pudo conectar con el servidor. Verifica que esté corriendo en http://localhost:3001');
            return null;
        }
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
     * Merges updates with existing user data, persists to localStorage and saves to MongoDB
     *
     * @param {Partial<User>} updates - Object containing user data updates
     */
    const updateUser = async (updates) => {
        if (!user)
            return;
        try {
            // Enviar actualización al backend
            const response = await fetch(`${API_URL}/api/user/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    workExperience: updates.workExperience ?? user.workExperience,
                    targetSector: updates.targetSector ?? user.targetSector,
                    targetRole: updates.targetPosition ?? user.targetRole, // Mapear targetPosition a targetRole
                    strengths: updates.mainSkills ?? user.mainSkills, // Mapear mainSkills a strengths
                    improvements: updates.areasToImprove ?? user.areasToImprove, // Mapear areasToImprove a improvements
                    totalXP: updates.totalXP ?? user.totalXP,
                    level: updates.level ?? user.level,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error al actualizar perfil' }));
                console.error('Error al actualizar perfil:', errorData.message);
                alert('No se pudo guardar el perfil en el servidor');
                return;
            }
            const data = await response.json();
            console.log('Perfil actualizado en el servidor:', data);
            // Actualizar el usuario local con los datos del servidor
            const updatedUser = {
                ...user,
                ...updates,
                // Mapear de vuelta los campos del servidor
                targetPosition: data.user?.targetRole || updates.targetPosition,
                mainSkills: data.user?.strengths || updates.mainSkills,
                areasToImprove: data.user?.improvements || updates.areasToImprove,
                totalXP: data.user?.totalXP ?? updates.totalXP ?? user.totalXP,
                level: data.user?.level ?? updates.level ?? user.level,
                isAdmin: data.user?.isAdmin ?? user.isAdmin,
            };
            localStorage.setItem('jobsy-user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            alert('Perfil guardado exitosamente');
        }
        catch (error) {
            console.error('Error al conectar con el servidor:', error);
            alert('No se pudo conectar con el servidor para guardar el perfil');
        }
    };
    return {
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser
    };
}
