import { useState } from "react";

export interface User {
  name: string;
  email: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function useAuthentication() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('');

  const handleLogin = (loginData: LoginData) => {
    console.log('🔐 Login attempt:', loginData);
    
    // Simulate authentication (in real app, this would be an API call)
    const user = {
      name: loginData.email === 'demo@stkitts.com' ? 'Demo User' : loginData.email.split('@')[0],
      email: loginData.email
    };
    
    setCurrentUser(user);
    setUserName(user.name);
    setIsAuthenticated(true);
    
    console.log('✅ Login successful for:', user.name);
  };

  const handleSignUp = (signUpData: SignUpData) => {
    console.log('📝 Sign up attempt:', signUpData);
    
    // Simulate account creation (in real app, this would be an API call)
    const user = {
      name: `${signUpData.firstName} ${signUpData.lastName}`,
      email: signUpData.email
    };
    
    setCurrentUser(user);
    setUserName(user.name);
    setIsAuthenticated(true);
    
    console.log('✅ Account created for:', user.name);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserName('');
    console.log('👋 User logged out');
  };

  const updateUserName = (name: string) => {
    if (name && name.trim()) {
      setUserName(name.trim());
      console.log('👤 User name set to:', name.trim());
    }
  };

  return {
    isAuthenticated,
    authView,
    setAuthView,
    currentUser,
    userName,
    handleLogin,
    handleSignUp,
    handleLogout,
    updateUserName
  };
}