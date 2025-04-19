import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Login.module.css'; // Import the CSS module

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Invalid credentials');
        }
        return response.json();
      })
      .then(() => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', credentials.username);
        router.push('/');
      })
      .catch((error) => setError(error.message));
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