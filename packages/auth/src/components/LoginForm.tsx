import { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials } from '../types';

/**
 * Login Form props
 */
export interface LoginFormProps {
  /**
   * Callback on successful login
   */
  onSuccess?: () => void;

  /**
   * Show register link
   */
  showRegisterLink?: boolean;

  /**
   * Register link URL
   */
  registerUrl?: string;

  /**
   * Custom CSS class
   */
  className?: string;
}

/**
 * Login Form component
 * Integrated with @vhvplatform/go-framework authentication
 */
export function LoginForm({
  onSuccess,
  showRegisterLink = true,
  registerUrl = '/register',
  className = '',
}: LoginFormProps) {
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    const credentials: LoginCredentials = {
      email,
      password,
      remember,
    };

    try {
      await login(credentials);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by the auth slice
      console.error('Login failed:', error);
    }
  };

  return (
    <div className={`login-form ${className}`}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Login</h2>

      {error && (
        <div
          style={{
            padding: '10px',
            marginBottom: '20px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c33',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="email"
            style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="password"
            style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loading}
              style={{ marginRight: '8px' }}
            />
            <span>Remember me</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {showRegisterLink && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a href={registerUrl} style={{ color: '#007bff', textDecoration: 'none' }}>
            Don&apos;t have an account? Register
          </a>
        </div>
      )}
    </div>
  );
}
