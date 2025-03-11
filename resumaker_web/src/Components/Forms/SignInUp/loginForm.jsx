import './forms.css';

export default function LoginForm() {
  return (
    <div className="form-container">
      <h2 className="form-title">Login</h2>
      <form>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            className="form-input"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            className="form-input"
            placeholder="Enter your password"
          />
        </div>
        <button 
          type="submit" 
          className="form-button"
        >
          Login
        </button>
      </form>
    </div>
  );
}