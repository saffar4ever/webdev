import { useState, useEffect } from 'react';
import styles from '@/styles/Login.module.css'; // Reuse the Login styles

export default function EditTestCaseForm({ selectedTestCase, onSave }) {
  const [formData, setFormData] = useState({
    Prompt: '',
    Truth: '',
  });

  useEffect(() => {
    if (selectedTestCase) {
      setFormData({
        Prompt: selectedTestCase.Prompt,
        Truth: selectedTestCase.Truth,
      });
    }
  }, [selectedTestCase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedTestCase = {
      ...selectedTestCase, // Keep the existing ID and other fields
      Prompt: formData.Prompt,
      Truth: formData.Truth,
      Response: '', // Reset Response
      Executed: false, // Reset Executed
      Analysis: '', // Reset Analysis
    };

    fetch('/api/testCases', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTestCase),
    })
      .then((response) => response.json())
      .then(() => {
        onSave(); // Notify the parent component
      })
      .catch((error) => console.error('Error updating test case:', error));
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Edit Test Case</h2>
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
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}