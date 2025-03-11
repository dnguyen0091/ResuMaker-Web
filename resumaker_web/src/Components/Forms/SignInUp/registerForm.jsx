import './forms.css';

export default function RegisterForm() {
  return (
    <div className="form-container">
      <h2 className="form-title">Register</h2>
      <form>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            className="form-input"
            placeholder="Enter your full name"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="registerEmail">Email</label>
          <input 
            type="email" 
            id="registerEmail" 
            className="form-input"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="registerPassword">Password</label>
          <input 
            type="password" 
            id="registerPassword" 
            className="form-input"
            placeholder="Create password"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            className="form-input"
            placeholder="Confirm password"
          />
        </div>
        <button 
          type="submit" 
          className="form-button"
        >
          Register
        </button>
      </form>
    </div>
  );
}