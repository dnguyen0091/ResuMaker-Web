import { useEffect, useState } from 'react';
import './forms.css';

export default function RegisterForm() {
  // Form state management
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    length: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    matchesConfirm: false
  });
  
  // UI state management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };
  
  // Check password strength in real-time
  useEffect(() => {
    const { password, confirmPassword } = formData;
    
    // Password validation criteria
    const length = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const matchesConfirm = password === confirmPassword && password !== '';
    
    // Check if all criteria are met
    const isValid = length && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    
    setPasswordValidation({
      isValid,
      length,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      matchesConfirm
    });
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error/success messages
    setError('');
    setSuccessMsg('');
    
    // Client-side validation
    if (!passwordValidation.isValid) {
      setError('Please ensure your password meets all requirements');
      return;
    }
    
    if (!passwordValidation.matchesConfirm) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // API URL (best practice: use environment variables)
      const API_URL = 'https://resumaker-api.onrender.com';
      
      // Send registration data to backend
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          login: formData.email,
          password: formData.password
        })
      });
      
      // Parse response
      const data = await response.json();
      
      // Handle non-successful responses
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Handle successful registration
      setSuccessMsg('Registration successful! You can now log in.');
      
      // Optional: Store token if returned and auto-login
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Could redirect or update global auth state here
      }
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Register</h2>
      
      {/* Error message */}
      {error && <div className="form-error">{error}</div>}
      
      {/* Success message */}
      {successMsg && <div className="form-success">{successMsg}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="firstName">First Name</label>
          <input 
            type="text" 
            id="firstName" 
            className="form-input"
            placeholder="Ex. John"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="lastName">Last Name</label>
          <input 
            type="text" 
            id="lastName" 
            className="form-input"
            placeholder="Ex. Doe"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            className="form-input"
            placeholder="Ex. example@example.org"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <div className="password-input-container">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              className="form-input"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button 
              type="button"
              className="password-toggle-button"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? (
                <i className="password-icon hide-password">👁️‍🗨️</i>
              ) : (
                <i className="password-icon show-password">👁️</i>
              )}
            </button>
          </div>
          
          {/* Password requirements checklist */}
          {formData.password && (
            <div className="password-requirements">
              <p className="requirements-title">Password must have:</p>
              <ul className="requirements-list">
                <li className={passwordValidation.length ? 'met' : 'not-met'}>
                  At least 8 characters
                </li>
                <li className={passwordValidation.hasUppercase ? 'met' : 'not-met'}>
                  At least one uppercase letter
                </li>
                <li className={passwordValidation.hasLowercase ? 'met' : 'not-met'}>
                  At least one lowercase letter
                </li>
                <li className={passwordValidation.hasNumber ? 'met' : 'not-met'}>
                  At least one number
                </li>
                <li className={passwordValidation.hasSpecialChar ? 'met' : 'not-met'}>
                  At least one special character
                </li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input-container">
            <input 
              type={showPassword ? "text" : "password"} 
              id="confirmPassword" 
              className="form-input"
              placeholder="Confirm password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button 
              type="button"
              className="password-toggle-button"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? (
                <i className="password-icon hide-password">👁️‍🗨️</i>
              ) : (
                <i className="password-icon show-password">👁️</i>
              )}
            </button>
          </div>
          
          {/* Password match indicator */}
          {formData.confirmPassword && (
            <div className={`password-match ${passwordValidation.matchesConfirm ? 'matched' : 'not-matched'}`}>
              {passwordValidation.matchesConfirm ? 'Passwords match ✓' : 'Passwords do not match ✗'}
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="form-button"
          disabled={isLoading || !passwordValidation.isValid || !passwordValidation.matchesConfirm}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}