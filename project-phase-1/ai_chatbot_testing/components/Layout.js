import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/Layout.module.css'; // Import the CSS module

export default function Layout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const isLoggedIn = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(!!isLoggedIn);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated'); // Remove authentication flag
    setIsAuthenticated(false); // Update state
    router.push('/login'); // Redirect to login page
  };

  return (
    <div className={styles.layoutWrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI Chatbot Testing App</h1>
        {isAuthenticated && (
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/testCases">Test Cases</Link></li>
              <li><Link href="/execute">Execute</Link></li>
              <li><Link href="/analysis">Analysis</Link></li>
              <li>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>
      <main className={styles.mainContent}>{children}</main>
      <footer className={styles.footer}>
        <p>&copy; 2025 AI Chatbot Testing App</p>
      </footer>
    </div>
  );
}