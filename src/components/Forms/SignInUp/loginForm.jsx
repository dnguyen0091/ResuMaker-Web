import { useState } from 'react';
import { useNavigate } from 'react-router';
import eyeClosedIcon from '../../../assets/Icons/eyeClosed.svg';
import eyeOpenIcon from '../../../assets/Icons/eyeOpen.svg';
import './forms.css';

export default function LoginForm() {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg,setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loginStep,setLoginStep] = useState('login');
  
  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const API_URL = 'https://resumaker-api.onrender.com';
      
      // Send login request to backend
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      console.log(formData.email,formData.password);
      // Parse response
      const data = await response.json();
      
      // Handle unsuccessful login
      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }
      
      // Handle successful login
      console.log('Login successful', data);
      
      // Store auth token
      if (data.token) {
        localStorage.setItem('token', data.token);
        
        // Store user data if needed
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
      }
      navigate('/resume-builder');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

    // Handle request password reset
    const handleResetRequest = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
      setSuccessMsg('');
      
      try {
        const API_URL = 'https://resumaker-api.onrender.com';
        
        // Send request to initiate password reset
        const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
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
          throw new Error(data.message || 'Failed to send reset code');
        }
        
        setSuccessMsg('A password reset code has been sent to your email.');
        setLoginStep('resetCode');
        
        // Store any temporary tokens if needed
        if (data.resetToken) {
          localStorage.setItem('tempResetToken', data.resetToken);
        }
        
      } catch (err) {
        setError(err.message || 'Failed to send reset code. Please try again.');
        console.error('Reset request error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Handle verification of reset code
    const handleVerifyResetCode = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
      
      try {
        const API_URL = 'https://resumaker-api.onrender.com';
        const resetCode = document.getElementById('resetCode').value;
        const tempToken = localStorage.getItem('tempResetToken');
        
        // Verify reset code
        const response = await fetch(`${API_URL}/api/auth/verify-reset-code`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(tempToken && { 'Authorization': `Bearer ${tempToken}` }),
          },
          body: JSON.stringify({
            email: formData.email,
            resetCode: resetCode
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Invalid reset code');
        }
        
        setSuccessMsg('Code verified. Please set a new password.');
        setLoginStep('newPassword');
        
      } catch (err) {
        setError(err.message || 'Code verification failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Handle password reset
    const handleResetPassword = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
      
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmNewPassword').value;
      
      // Validate passwords match
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      
      // Basic password validation - you could add more robust validation here
      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters long');
        setIsLoading(false);
        return;
      }
      
      try {
        const API_URL = 'https://resumaker-api.onrender.com';
        const tempToken = localStorage.getItem('tempResetToken');
        
        // Reset password
        const response = await fetch(`${API_URL}/api/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(tempToken && { 'Authorization': `Bearer ${tempToken}` }),
          },
          body: JSON.stringify({
            email: formData.email,
            password: newPassword
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Password reset failed');
        }
        
        // Clean up
        localStorage.removeItem('tempResetToken');
        
        setSuccessMsg('Password has been reset successfully!');
        setLoginStep('login');
        
        // Clear password fields
        setFormData({...formData, password: ''});
        
      } catch (err) {
        setError(err.message || 'Password reset failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };


    return (
    <div className="form-container">
      {loginStep === 'login' && (
        <>
          <h2 className="form-title">Login</h2>
          
          {/* Error message */}
          {error && <div className="form-error">{error}</div>}
          
          {/* Success message */}
          {successMsg && <div className="form-success">{successMsg}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                className="form-input"
                placeholder="Enter your email"
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
                  placeholder="Enter password"
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
                    <img className="password-icon hide-password" src={eyeOpenIcon} alt="Hide password" />
                  ) : (
                    <img className="password-icon show-password" src={eyeClosedIcon} alt="Show password" />
                  )}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              className="form-button"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            <div className="forgot-password">
              <button 
                type="button" 
                className="forgot-button"
                onClick={() => setLoginStep('resetRequest')}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </>
      )}

      {loginStep === 'resetRequest' && (
        <div className="verification-container">
          <h2 className="form-title">Reset Password</h2>
          
          {/* Error message */}
          {error && <div className="form-error">{error}</div>}
          
          {/* Success message */}
          {successMsg && <div className="form-success">{successMsg}</div>}
          
          <p className="verification-message">Please enter your email address to receive a password reset code.</p>
          
          <form onSubmit={handleResetRequest} className="verification-form">
            <div className="form-group">
              {/* <label className="form-label" htmlFor="email">Email</label> */}
              <input 
                type="email" 
                id="email" 
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <button 
              type="submit" 
              className="form-button"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
            
            <div className="back-to-login">
              <button 
                type="button" 
                className="back-button"
                onClick={() => setLoginStep('login')}
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      )}

      {loginStep === 'resetCode' && (
        <div className="verification-container">
          <h2 className="form-title">Verify Code</h2>
          
          {/* Error message */}
          {error && <div className="form-error">{error}</div>}
          
          {/* Success message */}
          {successMsg && <div className="form-success">{successMsg}</div>}
          
          <p className="verification-message">We've sent a verification code to <strong>{formData.email}</strong>.</p>
          
          <form onSubmit={handleVerifyResetCode} className="verification-form">
            <div className="form-group">
              <label className="form-label" htmlFor="resetCode">Reset Code</label>
              <input 
                type="text" 
                id="resetCode" 
                className="form-input" 
                placeholder="Enter reset code" 
                required
              />
            </div>
            <button 
              type="submit" 
              className="form-button"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
            
            <div className="back-to-login">
              <button 
                type="button" 
                className="back-button"
                onClick={() => setLoginStep('login')}
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      )}

      {loginStep === 'newPassword' && (
        <div className="verification-container">
          <h2 className="form-title">Set New Password</h2>
          
          {/* Error message */}
          {error && <div className="form-error">{error}</div>}
          
          {/* Success message */}
          {successMsg && <div className="form-success">{successMsg}</div>}
          
          <form onSubmit={handleResetPassword} className="verification-form">
            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New Password</label>
              <div className="password-input-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="newPassword" 
                  className="form-input"
                  placeholder="Enter new password"
                  required
                />
                <button 
                  type="button"
                  className="password-toggle-button"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? (
                    <img className="password-icon hide-password" src={eyeOpenIcon} alt="Hide password" />
                  ) : (
                    <img className="password-icon show-password" src={eyeClosedIcon} alt="Show password" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="confirmNewPassword">Confirm Password</label>
              <div className="password-input-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="confirmNewPassword" 
                  className="form-input"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="form-button"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      )}
      {(loginStep==='verifyAccount') && (
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
    </div>
  );
}