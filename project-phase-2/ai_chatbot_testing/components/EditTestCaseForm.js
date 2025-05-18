import { useState, useEffect } from 'react';
import styles from '@/styles/Login.module.css'; // Reuse the Login styles

export default function EditTestCaseForm({ selectedTestCase, onSave }) {
  const [formData, setFormData] = useState({
    prompt: '',
    truth: '',
  });

  useEffect(() => {
    if (selectedTestCase) {
      setFormData({
        prompt: selectedTestCase.prompt,
        truth: selectedTestCase.truth,
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
      prompt: formData.prompt,
      truth: formData.truth,
      response: '', // Reset response
      executed: false, // Reset executed
      analysis: '', // Reset analysis
      operationType: 'edit', // Specify the operation type
    };

    fetch('/api/testCases', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTestCase),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error('Error from backend:', data.error);
        } else {
          onSave(); // Notify the parent component
        }
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
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Truth:</label>
              <input
                type="text"
                name="truth"
                value={formData.truth}
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