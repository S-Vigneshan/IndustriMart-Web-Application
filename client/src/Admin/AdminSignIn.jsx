import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminSignIn = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (
        credentials.email === 'admin@example.com' &&
        credentials.password === 'admin@123'
      ) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f1f4f9' }}>
      <div className="card shadow p-4 rounded-4 border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <div
            className="bg-primary bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 60, height: 60 }}
          >
            <FaLock className="text-primary" size={26} />
          </div>
          <h3 className="fw-bold">Welcome Back</h3>
          <p className="text-muted">Enter your credentials to access the admin panel</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaUser className="text-muted" />
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="admin@example.com"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <div className="position-relative">
              
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control pe-5"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                className="position-absolute text-muted"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold mb-3"
            disabled={loading}
          >
            {loading ? (
              <div className="d-flex align-items-center justify-content-center">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center">
            <a href="/forgot-password" className="small text-decoration-none text-primary">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignIn;
