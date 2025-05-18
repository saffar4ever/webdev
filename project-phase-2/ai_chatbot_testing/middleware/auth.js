import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode('0959d63f029763711d4f26862cfcc5a8efbf9ba8ecf257ab57ec2e0bb3a3fe78');

export async function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    console.log('Token:', token);
    console.log('Payload:', payload);
    req.user = payload; // Attach user info to the request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}