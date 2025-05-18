import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { jwtVerify } from 'jose'; // Use jose for token verification
import styles from '../styles/Layout.module.css';

const SECRET_KEY = new TextEncoder().encode('0959d63f029763711d4f26862cfcc5a8efbf9ba8ecf257ab57ec2e0bb3a3fe78');

export default function Layout({ children }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (router.pathname === '/login') {
        console.log('On login page, skipping auth check');
        return;
      }

      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      console.log('Token in Layout:', token); // Debugging token in Layout

      if (token) {
        try {
          await jwtVerify(token, SECRET_KEY);
          console.log('Token is valid'); // Debugging valid token
          setIsLoggedIn(true); // User is logged in
        } catch (error) {
          console.error('Invalid token:', error); // Debugging invalid token
          setIsLoggedIn(false);
          router.push('/login');
        }
      } else {
        console.error('No token found in Layout'); // Debugging missing token in Layout
        setIsLoggedIn(false);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    console.log('Logging out...');
    document.cookie = 'token=; Max-Age=0; path=/;';
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <div className={styles.layoutWrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI Chatbot Testing App</h1>
        {isLoggedIn && ( // Conditionally render the navigation menu
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/testCases">Test Cases</Link></li>
              <li><Link href="/execute">Execute</Link></li>
              <li><Link href="/analysis">Analysis</Link></li>
              <li><button onClick={handleLogout} className={styles.logoutButton}>Logout</button></li>
            </ul>
          </nav>
        )}
      </header>
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}