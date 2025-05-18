import { useState } from 'react';
import styles from '@/styles/Login.module.css'; // Reuse the Login styles
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode('0959d63f029763711d4f26862cfcc5a8efbf9ba8ecf257ab57ec2e0bb3a3fe78');

const getTokenFromCookies = () => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
  return token;
};

const getUserIdFromToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.id; // Assuming `id` is the userId in the token payload
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

export default function AddTestCaseForm({ onSave }) {
  const [formData, setFormData] = useState({
    Prompt: '',
    Truth: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getTokenFromCookies();
    if (!token) {
      console.error('No token found in cookies');
      return;
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
      console.error('Failed to retrieve userId from token');
      return;
    }

    const newTestCase = {
      id: Date.now().toString(), // Generate a unique ID
      prompt: formData.Prompt, // Use lowercase keys
      truth: formData.Truth,   // Use lowercase keys
      response: '',
      executed: false,
      analysis: '',
      userId, // Include the userId
    };

    console.log('Submitting test case:', newTestCase); // Debug: Log the data being sent

    fetch('/api/testCases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTestCase),
    })
      .then((response) => {
        console.log('Response status:', response.status); // Debug: Log the response status
        return response.json();
      })
      .then((data) => {
        console.log('Response data:', data); // Debug: Log the response data
        if (data.error) {
          console.error('Error from backend:', data.error); // Debug: Log backend error
        } else {
          onSave(); // Notify the parent component
          setFormData({
            Prompt: '',
            Truth: '',
          });
        }
      })
      .catch((error) => {
        console.error('Error adding test case:', error); // Debug: Log any fetch errors
      });
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Add Test Case</h2>
      <br />
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Prompt:</label>
              <input
                type="text"
                name="Prompt"
                value={formData.Prompt}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Truth:</label>
              <input
                type="text"
                name="Truth"
                value={formData.Truth}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <button type="submit" className={styles.button}>
              Add Test Case
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}