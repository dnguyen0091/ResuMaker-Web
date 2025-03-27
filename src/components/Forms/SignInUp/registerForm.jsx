import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eyeClosedIcon from '../../../assets/Icons/eyeClosed.svg';
import eyeOpenIcon from '../../../assets/Icons/eyeOpen.svg';
import '../../../index.css';
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
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  
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

  const [registrationStep, setRegistrationStep] = useState('form');
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
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      localStorage.setItem('email', formData.email);
      setRegistrationStep('verification');


      // Registration successful: store token and user data
      setSuccessMsg('User registered successfully!');
      // setRegistrationStep('complete');
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      console.log(localStorage.getItem('user'));
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

  
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const API_URL = 'https://resumaker-api.onrender.com';
      const verificationCode = document.getElementById('verificationCode').value;
      const tempToken = localStorage.getItem('tempRegToken');
      
      // Connect to endpoint to verify user
      const email=localStorage.getItem('email');
      console.log(email + " " + verificationCode);
      const response = await fetch(`${API_URL}/api/auth/verifyEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include temp token if available
          ...(tempToken && { 'Authorization': `Bearer ${tempToken}` }),
        },
        body: JSON.stringify({
          email: email,
          verificationCode: verificationCode
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }
      
      // Verification successful
      localStorage.removeItem('tempRegToken'); // Clean up temp token
      localStorage.removeItem('email');
      
      navigate('/resume-builder');
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  
  // Handle verification completion
  const handleVerificationComplete = () => {
    setSuccessMsg('Registration successful! You can now log in.');
    setRegistrationStep('complete');
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };
  
  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMsg('');
    
    try {
      const API_URL = 'https://resumaker-api.onrender.com';
      
      // Send request to resend verification code
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification code');
      }
      
      setSuccessMsg('A new verification code has been sent to your email.');
      
    } catch (err) {
      setError(err.message || 'Failed to resend verification code. Please try again.');
      console.error('Resend verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="form-container">
      {registrationStep === 'form' && (
      <>
      <h2 className="form-title">Register</h2>
      
      {/* Error message */}
      {error && <div className="form-error">{error}</div>}
      
      {/* Success message */}
      {successMsg && <div className="form-success">{successMsg}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="nameGroup">
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
                <img className="password-icon hide-password" src={eyeOpenIcon}></img>
              ) : (
                <img className="password-icon show-password" src={eyeClosedIcon}></img>
              )}
            </button>
          </div>
          
          {/* Password requirements checklist */}
          {formData.password && (
            <div className="password-requirements">
              <p className="requirements-title" id="reqTitle">Password must have:</p>
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
              type={showConfirmPassword ? "text" : "password"} 
              id="confirmPassword" 
              className="form-input"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button 
              type="button"
              className="password-toggle-button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
            >
              {showConfirmPassword ? (
                <img className="password-icon hide-password" src={eyeOpenIcon}></img>
              ) : (
                <img className="password-icon show-password" src={eyeClosedIcon}></img>
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
      </>
      )}
      {registrationStep === 'verification' && (
        <div className="verification-container">
          <h2 className="form-title">Verify</h2>
          
          {/* Error message */}
          {error && <div className="form-error">{error}</div>}
          
          {/* Success message */}
          {successMsg && <div className="form-success">{successMsg}</div>}
          
          <p className="verification-message">We've sent a verification code to <strong>{formData.email}</strong>.</p>
          
          <form onSubmit={handleVerificationSubmit} className="verification-form">
            <div className="form-group">
              {/* <label className="form-label" htmlFor="verificationCode">Verification Code</label> */}
              <input 
                type="text" 
                id="verificationCode" 
                className="form-input" 
                placeholder="Enter verification code" 
                required
              />
            </div>
            <button 
              type="submit" 
              className="form-button"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
            
            <div className="resend-code">
              <p>Didn't receive a code?</p>
              <button 
                type="button" 
                className="resend-button"
                onClick={handleResendCode}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
          </form>
        </div>
      )}
      {registrationStep === 'complete' && (
        <div className="verification-container">
          <h2 className="form-title">Registration Complete</h2>
          <p className="verification-message form-success">Registration successful! You can now log in.</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="form-button"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
    
  );
}