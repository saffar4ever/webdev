import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { jwtVerify } from 'jose';
import '@/styles/globals.css';

const SECRET_KEY = new TextEncoder().encode('0959d63f029763711d4f26862cfcc5a8efbf9ba8ecf257ab57ec2e0bb3a3fe78');

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        // Redirect to login if no token is found
        if (router.pathname !== '/login') {
          router.push('/login');
        }
      } else {
        try {
          await jwtVerify(token, SECRET_KEY);
          // Token is valid, stay on current page
        } catch (error) {
          // Invalid token, redirect to login
          if (router.pathname !== '/login') {
            router.push('/login');
          }
        }
      }
    };

    verifyAuth();
  }, [router.pathname]);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}