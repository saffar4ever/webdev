import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode('0959d63f029763711d4f26862cfcc5a8efbf9ba8ecf257ab57ec2e0bb3a3fe78');

export default async function handler(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    res.status(200).json({ message: 'This is a protected route', user: payload });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}