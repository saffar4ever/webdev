import prisma from '../../lib/prisma';
import { SignJWT } from 'jose';
import { serialize } from 'cookie';

const SECRET_KEY = new TextEncoder().encode('0959d63f029763711d4f26862cfcc5a8efbf9ba8ecf257ab57ec2e0bb3a3fe78');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await prisma.user.findFirst({
      where: { username, password },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = await new SignJWT({ id: user.id, username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(SECRET_KEY);

    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: false, // Allow access to the cookie in JavaScript ... OMG This took me 4 hours to figure out
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    }));

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}