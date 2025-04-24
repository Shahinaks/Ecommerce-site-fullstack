import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaLock, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
        const res = await axios.post(`${backendUrl}/api/auth/login`, credentials);
      localStorage.setItem('token', res.data.token);
      setMessage('Login successful! Redirecting...');
      setVariant('success');
      setTimeout(() => navigate('/products'), 1500); // Redirect after 1.5 seconds
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Invalid email or password');
      setVariant('danger');
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: 'lavenderblush'
      }}
    >
      <div className="row shadow rounded-4 overflow-hidden w-100" style={{ maxWidth: '900px' }}>
        {/* Image section */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="https://plus.unsplash.com/premium_photo-1720192861639-1524439fc166?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bG9naW58ZW58MHx8MHx8fDA%3D"
            alt="Login"
            className="img-fluid h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Form section */}
        <div className="col-md-6 bg-white p-5">
          <h2 className="text-center mb-4">Welcome Back</h2>

          {/* Displaying the message directly */}
          {message && (
            <div className={`alert alert-${variant}`} role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Email address</label>
              <div className="input-group">
                <span className="input-group-text"><FaUser /></span>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={handleChange}
                  value={credentials.email} // Bind the state value to input
                  required
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label>Password</label>
              <div className="input-group">
                <span className="input-group-text"><FaLock /></span>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={handleChange}
                  value={credentials.password} // Bind the state value to input
                  required
                />
              </div>
            </div>

            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-3">
              Login
            </button>

            <div className="text-center">
              <small>
                Don’t have an account? <a href="/signup">Sign Up</a>
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
