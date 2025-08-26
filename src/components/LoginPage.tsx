import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { BookOpen, Shield, Eye, EyeOff } from 'lucide-react';
import { Theme } from '../utils/theming';

interface LoginPageProps {
  onLogin: (loginData: { email: string; password: string }) => void;
  onShowSignUp: () => void;
  theme: Theme;
  currentPersona: 'Ancestra' | 'The Guardian';
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

export default function LoginPage({ 
  onLogin, 
  onShowSignUp, 
  theme, 
  currentPersona, 
  onToggleDarkMode, 
  darkMode 
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onLogin({ email, password });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)'
      }}
    >
      {/* Simplified Floating Background Elements */}
      <div 
        className="absolute w-32 h-32 rounded-full opacity-5 animate-float"
        style={{ 
          background: 'radial-gradient(circle, #ef4444, #f87171)',
          top: '15%',
          left: '15%'
        }}
      ></div>
      <div 
        className="absolute w-20 h-20 rounded-full opacity-8 animate-float-delayed"
        style={{ 
          background: 'radial-gradient(circle, #0ea5e9, #38bdf8)',
          top: '25%',
          right: '20%'
        }}
      ></div>
      <div 
        className="absolute w-28 h-28 rounded-full opacity-6 animate-float"
        style={{ 
          background: 'radial-gradient(circle, #f87171, #0ea5e9)',
          bottom: '20%',
          left: '25%'
        }}
      ></div>

      <Card 
        className="w-full max-w-md transform hover:scale-105 transition-all duration-500 shadow-xl border-0 animate-fade-in"
        style={{ 
          backgroundColor: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="p-8 space-y-6">
          {/* Header with Clean Branding */}
          <div className="text-center space-y-4">
            <div 
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-lg animate-pulse-slow"
              style={{ 
                background: 'linear-gradient(135deg, #ef4444, #f87171)' 
              }}
            >
              {currentPersona === 'Ancestra' ? 
                <BookOpen className="w-8 h-8 text-white" /> : 
                <Shield className="w-8 h-8 text-white" />
              }
            </div>
            
            <div>
              <h1 
                className="text-3xl font-bold mb-2"
                style={{ color: '#1f2937' }}
              >
                Welcome Back!
              </h1>
              <p 
                className="text-lg opacity-70"
                style={{ color: '#6b7280' }}
              >
                Sign in to {currentPersona === 'Ancestra' ? 'explore St. Kitts heritage' : 'access safety guides'}
              </p>
            </div>

            {/* Clean Theme Toggle */}
            <Button
              onClick={onToggleDarkMode}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 opacity-50 hover:opacity-100"
              style={{ color: '#6b7280' }}
            >
              {darkMode ? '☀️' : '🌙'}
            </Button>
          </div>

          {/* Clean Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium"
                style={{ color: '#374151' }}
              >
                Email or Username
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full transition-all duration-300 border-gray-200 focus:border-coral-400"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e5e7eb',
                  color: '#1f2937'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ef4444';
                  e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium"
                style={{ color: '#374151' }}
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 transition-all duration-300"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    color: '#1f2937'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: '#6b7280' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!email.trim() || !password.trim() || isLoading}
              className="w-full py-3 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-105 border-0"
              style={{
                background: (email.trim() && password.trim() && !isLoading) 
                  ? 'linear-gradient(135deg, #ef4444, #f87171)'
                  : '#d1d5db',
                opacity: (email.trim() && password.trim() && !isLoading) ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (email.trim() && password.trim() && !isLoading) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (email.trim() && password.trim() && !isLoading) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444, #f87171)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Clean Sign Up Link */}
          <div className="text-center space-y-2">
            <p 
              className="text-sm"
              style={{ color: '#6b7280' }}
            >
              Don't have an account?
            </p>
            <Button
              onClick={onShowSignUp}
              variant="ghost"
              className="text-sm font-medium hover:scale-105 transition-all duration-200 p-0"
              style={{ color: '#0ea5e9' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0284c7'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#0ea5e9'}
            >
              Create your account →
            </Button>
          </div>

          {/* Clean Demo Account Info */}
          <div 
            className="text-center p-4 rounded-lg"
            style={{ 
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0'
            }}
          >
            <p 
              className="text-xs mb-2"
              style={{ color: '#64748b' }}
            >
              Quick Demo Access
            </p>
            <p 
              className="text-xs font-mono"
              style={{ color: '#475569' }}
            >
              Email: demo@stkitts.com<br />
              Password: demo123
            </p>
          </div>
        </div>
      </Card>

      {/* Simplified Branding Footer */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div 
          className="flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
        >
          <span className="text-xl">
            {currentPersona === 'Ancestra' ? '🌺' : '🛡️'}
          </span>
          <span 
            className="text-sm font-medium"
            style={{ color: '#374151' }}
          >
            {currentPersona} • St. Kitts & Nevis
          </span>
        </div>
      </div>
    </div>
  );
}