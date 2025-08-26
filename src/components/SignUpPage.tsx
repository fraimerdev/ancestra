import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { BookOpen, Shield, Eye, EyeOff, Check, X } from 'lucide-react';
import { Theme } from '../utils/theming';

interface SignUpData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  password: string;
  agreeToTerms: boolean;
}

interface SignUpPageProps {
  onSignUp: (signUpData: SignUpData) => void;
  onBackToLogin: () => void;
  theme: Theme;
  currentPersona: 'Ancestra' | 'The Guardian';
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

interface Errors {
  [key: string]: string;
}

export default function SignUpPage({ 
  onSignUp, 
  onBackToLogin, 
  theme, 
  currentPersona, 
  onToggleDarkMode, 
  darkMode 
}: SignUpPageProps) {
  const [formData, setFormData] = useState<SignUpData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    password: '',
    agreeToTerms: false,
  });
  
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof SignUpData, value: string | boolean) => {
    console.log('📝 Input changed:', field, value); // Debug log
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email format is invalid';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must accept the terms and conditions';

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setShowSuccess(true);
    
    setTimeout(() => {
      onSignUp(formData);
      setIsLoading(false);
    }, 2000);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (showSuccess) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)' }}
      >
        <Card 
          className="w-full max-w-md p-8 text-center animate-scale-in shadow-2xl border-0"
          style={{ 
            backgroundColor: '#ffffff'
          }}
        >
          <div 
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 animate-bounce-gentle"
            style={{ background: 'linear-gradient(135deg, #22c55e, #4ade80)' }}
          >
            <Check className="w-10 h-10 text-white" />
          </div>
          
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ color: '#1f2937' }}
          >
            🎉 Welcome to St. Kitts! 🎉
          </h2>
          
          <p 
            className="text-lg mb-4"
            style={{ color: '#374151' }}
          >
            Your account has been created successfully!
          </p>
          
          <p 
            className="text-sm"
            style={{ color: '#6b7280' }}
          >
            Redirecting you to your {currentPersona === 'Ancestra' ? 'heritage' : 'safety'} guide...
          </p>

          <div className="flex justify-center mt-6">
            <div className="flex space-x-1">
              <div 
                className="w-2 h-2 rounded-full animate-bounce" 
                style={{ backgroundColor: '#ef4444', animationDelay: '0s' }}
              ></div>
              <div 
                className="w-2 h-2 rounded-full animate-bounce" 
                style={{ backgroundColor: '#0ea5e9', animationDelay: '0.2s' }}
              ></div>
              <div 
                className="w-2 h-2 rounded-full animate-bounce" 
                style={{ backgroundColor: '#ef4444', animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)' }}
    >
      {/* Simplified Floating Background Elements */}
      <div 
        className="absolute w-32 h-32 rounded-full opacity-4 animate-float"
        style={{ 
          background: 'radial-gradient(circle, #ef4444, #f87171)',
          top: '8%',
          left: '8%'
        }}
      ></div>
      <div 
        className="absolute w-24 h-24 rounded-full opacity-6 animate-float-delayed"
        style={{ 
          background: 'radial-gradient(circle, #0ea5e9, #38bdf8)',
          top: '15%',
          right: '15%'
        }}
      ></div>
      <div 
        className="absolute w-36 h-36 rounded-full opacity-4 animate-float"
        style={{ 
          background: 'radial-gradient(circle, #f87171, #0ea5e9)',
          bottom: '15%',
          left: '20%'
        }}
      ></div>

      <Card 
        className="w-full max-w-2xl transform hover:scale-105 transition-all duration-500 shadow-xl border-0 animate-fade-in"
        style={{ 
          backgroundColor: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div 
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-xl animate-pulse-slow"
              style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)' }}
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
                Join St. Kitts Community!
              </h1>
              <p 
                className="text-lg opacity-70"
                style={{ color: '#6b7280' }}
              >
                Create your account to {currentPersona === 'Ancestra' ? 'explore our heritage' : 'stay safe while traveling'}
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

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label 
                  htmlFor="firstName" 
                  className="block text-sm font-medium"
                  style={{ color: '#374151' }}
                >
                  First Name *
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full transition-all duration-300 ${errors.firstName ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: errors.firstName ? '#ef4444' : '#e5e7eb',
                    color: '#1f2937'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.firstName ? '#ef4444' : '#ef4444';
                    e.target.style.boxShadow = `0 0 0 3px ${errors.firstName ? '#ef444420' : 'rgba(239, 68, 68, 0.1)'}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.firstName ? '#ef4444' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <X className="w-3 h-3" />
                    <span>{errors.firstName}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label 
                  htmlFor="lastName" 
                  className="block text-sm font-medium"
                  style={{ color: '#374151' }}
                >
                  Last Name *
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full transition-all duration-300 ${errors.lastName ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: errors.lastName ? '#ef4444' : '#e5e7eb',
                    color: '#1f2937'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.lastName ? '#ef4444' : '#ef4444';
                    e.target.style.boxShadow = `0 0 0 3px ${errors.lastName ? '#ef444420' : 'rgba(239, 68, 68, 0.1)'}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.lastName ? '#ef4444' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <X className="w-3 h-3" />
                    <span>{errors.lastName}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label 
                htmlFor="dateOfBirth" 
                className="block text-sm font-medium"
                style={{ color: '#374151' }}
              >
                Date of Birth *
              </label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className={`w-full transition-all duration-300 ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: errors.dateOfBirth ? '#ef4444' : '#e5e7eb',
                  color: '#1f2937',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ef4444';
                  e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.dateOfBirth ? '#ef4444' : '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
                max={new Date().toISOString().split('T')[0]}
                min="1900-01-01"
                placeholder="Select your date of birth"
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <X className="w-3 h-3" />
                  <span>{errors.dateOfBirth}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium"
                style={{ color: '#374151' }}
              >
                Email Address *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full transition-all duration-300 ${errors.email ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: errors.email ? '#ef4444' : '#e5e7eb',
                  color: '#1f2937'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ef4444';
                  e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#ef4444' : '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <X className="w-3 h-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label 
                htmlFor="phoneNumber" 
                className="block text-sm font-medium"
                style={{ color: '#374151' }}
              >
                Phone Number *
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1 (869) 123-4567"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={`w-full transition-all duration-300 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: errors.phoneNumber ? '#ef4444' : '#e5e7eb',
                  color: '#1f2937'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ef4444';
                  e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.phoneNumber ? '#ef4444' : '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <X className="w-3 h-3" />
                  <span>{errors.phoneNumber}</span>
                </p>
              )}
            </div>

            {/* Password with Strength Indicator */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium"
                style={{ color: '#374151' }}
              >
                Password *
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pr-10 transition-all duration-300 ${errors.password ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: errors.password ? '#ef4444' : '#e5e7eb',
                    color: '#1f2937'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? '#ef4444' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="flex-1 h-2 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: passwordStrength >= level 
                            ? level <= 2 ? '#ef4444' : level === 3 ? '#f59e0b' : '#22c55e'
                            : '#e5e7eb'
                        }}
                      ></div>
                    ))}
                  </div>
                  <p 
                    className="text-xs"
                    style={{ 
                      color: passwordStrength <= 2 ? '#ef4444' : passwordStrength === 3 ? '#f59e0b' : '#22c55e'
                    }}
                  >
                    Password strength: {['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength]}
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <X className="w-3 h-3" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', !!checked)}
                  className="mt-1"
                  style={{
                    borderColor: errors.agreeToTerms ? '#ef4444' : '#e5e7eb'
                  }}
                />
                <div className="space-y-1">
                  <label 
                    htmlFor="agreeToTerms" 
                    className="text-sm leading-relaxed cursor-pointer"
                    style={{ color: '#374151' }}
                  >
                    I agree to the{' '}
                    <button
                      type="button"
                      className="font-medium hover:underline transition-colors duration-200"
                      style={{ color: '#0ea5e9' }}
                      onClick={() => alert('Terms of Service would open here')}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#0284c7'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#0ea5e9'}
                    >
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button
                      type="button"
                      className="font-medium hover:underline transition-colors duration-200"
                      style={{ color: '#0ea5e9' }}
                      onClick={() => alert('Privacy Policy would open here')}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#0284c7'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#0ea5e9'}
                    >
                      Privacy Policy
                    </button>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <X className="w-3 h-3" />
                      <span>{errors.agreeToTerms}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-105 border-0"
              style={{
                background: !isLoading 
                  ? 'linear-gradient(135deg, #ef4444, #f87171)'
                  : '#d1d5db',
                opacity: !isLoading ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444, #f87171)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="text-center space-y-2">
            <p 
              className="text-sm"
              style={{ color: '#6b7280' }}
            >
              Already have an account?
            </p>
            <Button
              onClick={onBackToLogin}
              variant="ghost"
              className="text-sm font-medium hover:scale-105 transition-all duration-200 p-0"
              style={{ color: '#0ea5e9' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0284c7'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#0ea5e9'}
            >
              ← Sign in instead
            </Button>
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