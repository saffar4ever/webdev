import { useState } from 'react';
import styles from '@/styles/Login.module.css'; // Reuse the Login styles

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTestCase = {
      ID: Date.now().toString(), // Generate a unique ID
      Prompt: formData.Prompt,
      Truth: formData.Truth,
      Response: '',
      Executed: false,
      Analysis: '',
    };

    fetch('/api/testCases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTestCase),
    })
      .then((response) => response.json())
      .then(() => {
        onSave(); // Notify the parent component
        setFormData({
          Prompt: '',
          Truth: '',
        });
      })
      .catch((error) => console.error('Error adding test case:', error));
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