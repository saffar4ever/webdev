import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const isLoggedIn = localStorage.getItem('isAuthenticated');
    if (!isLoggedIn && router.pathname !== '/login') {
      router.push('/login'); // Redirect to login if not authenticated
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Show nothing until authentication is verified
  if (!isAuthenticated && router.pathname !== '/login') {
    return null;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}