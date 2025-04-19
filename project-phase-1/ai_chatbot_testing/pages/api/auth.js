import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'users.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      res.status(200).json({ message: 'Authentication successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}