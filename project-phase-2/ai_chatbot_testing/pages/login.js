import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Login.module.css';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('handleSubmit - credentials:', credentials); // Debugging submitted credentials

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      console.log('handleSubmit - response status:', response.status); // Debugging response status
      const data = await response.json();
      console.log('handleSubmit - response data:', data); // Debugging response data

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store the token in a cookie
      document.cookie = `token=${data.token}; path=/; secure; HttpOnly`;
      console.log('handleSubmit - token stored in cookie'); // Debugging token storage
      console.log('Stored cookies:', document.cookie); // Debugging stored cookies

      // Redirect to the main page
      router.replace('/');
      console.log('handleSubmit - redirecting to main page'); // Debugging redirection
    } catch (error) {
      console.error('handleSubmit - error:', error.message); // Debugging error
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Username:</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password:</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}