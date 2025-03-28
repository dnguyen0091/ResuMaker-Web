import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import eyeClosedIcon from '../../../assets/Icons/eyeClosed.svg';
import eyeOpenIcon from '../../../assets/Icons/eyeOpen.svg';
// import { useAuth } from '../../../context/AuthContext';
import './forms.css';

export default function LoginForm() {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // const { loginUser } = useAuth();

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg,setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginStep,setLoginStep] = useState('login');
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    length: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    matchesConfirm: false
  });
  
  // Add a state to track the new password
  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });

  const handleNewPasswordChange = (e) => {
    const { id, value } = e.target;
    setNewPasswordData(prevData => ({
      ...prevData,
      [id === 'newPassword' ? 'newPassword' : 'confirmNewPassword']: value
    }));
  };


  useEffect(() => {
    if (loginStep === 'newPassword') {
      const { newPassword, confirmNewPassword } = newPasswordData;
      
      // Password validation criteria
      const length = newPassword.length >= 8;
      const hasUppercase = /[A-Z]/.test(newPassword);
      const hasLowercase = /[a-z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
      const matchesConfirm = newPassword === confirmNewPassword && newPassword !== '';
      
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
    }
  }, [newPasswordData.newPassword, newPasswordData.confirmNewPassword, loginStep]);
  
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
      
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      console.log("User saved:", data.user);
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
        const response = await fetch(`${API_URL}/api/auth/forgotPassword`, {
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
        
        // Update success message and move to code verification step
        setSuccessMsg('A password reset code has been sent to your email.');
        setLoginStep('resetCode');
        
        // Remove this block since the endpoint no longer returns a resetToken
        // if (data.resetToken) {
        //   localStorage.setItem('tempResetToken', data.resetToken);
        // }
        
      } catch (err) {
        // Handle specific error cases based on the updated endpoint
        if (err.message === "Email not in use") {
          setError("No account found with this email address.");
        } else if (err.message === "Email not verified. Please re-register") {
          setError("Your account is not verified. Please register again.");
        } else {
          setError(err.message || 'Failed to send reset code. Please try again.');
        }
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
      setSuccessMsg('');
      
      try {
        const API_URL = 'https://resumaker-api.onrender.com';
        const resetCode = document.getElementById('resetCode').value;
        
        // Connect to endpoint to verify reset code
        const response = await fetch(`${API_URL}/api/auth/verifyForgot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            verificationCode: resetCode
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Verification failed');
        }
        
        // Verification successful
        setSuccessMsg('Verification successful. You can now set a new password.');
        
        // Store user data if needed
        if (data.user) {
          localStorage.setItem('resetUserData', JSON.stringify(data.user));
        }
        
        // Move to password reset screen
        setTimeout(() => {
          setLoginStep('newPassword');
        }, 1000);
        
      } catch (err) {
        setError(err.message || 'Verification failed. Please try again.');
        console.error('Reset code verification error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    const handleResetPassword = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
      
      // Client-side validation
      if (!passwordValidation.isValid) {
        setError('Please ensure your password meets all requirements');
        setIsLoading(false);
        return;
      }
      
      if (!passwordValidation.matchesConfirm) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      
      try {
        const API_URL = 'https://resumaker-api.onrender.com';
        
        // Send request to update password
        const response = await fetch(`${API_URL}/api/auth/updatePassword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: newPasswordData.newPassword
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to update password');
        }
        
        // Password update successful
        setSuccessMsg('Password has been successfully updated');
        
        // Clean up temporary tokens
        localStorage.removeItem('tempResetToken');
        
        // Reset form and return to login screen after a short delay
        setTimeout(() => {
          setLoginStep('login');
          setNewPasswordData({
            newPassword: '',
            confirmNewPassword: ''
          });
        }, 2000);
        
      } catch (err) {
        setError(err.message || 'Failed to update password. Please try again.');
        console.error('Password reset error:', err);
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
            value={newPasswordData.newPassword}
            onChange={handleNewPasswordChange}
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
        
        {/* Password requirements checklist */}
        {newPasswordData.newPassword && (
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
        <label className="form-label" htmlFor="confirmNewPassword">Confirm Password</label>
        <div className="password-input-container">
          <input 
            type={showPassword ? "text" : "password"} 
            id="confirmNewPassword" 
            className="form-input"
            placeholder="Confirm new password"
            value={newPasswordData.confirmNewPassword}
            onChange={handleNewPasswordChange}
            required
          />
        </div>
        
        {/* Password match indicator */}
        {newPasswordData.confirmNewPassword && (
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