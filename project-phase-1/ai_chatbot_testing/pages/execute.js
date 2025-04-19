import ExecuteTestCases from '@/components/ExecuteTestCases';
import { useState, useEffect } from 'react';
import styles from '@/styles/TestCases.module.css';

export default function Execute() {
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    // Fetch test cases from the API
    fetch('/api/testCases')
      .then((response) => response.json())
      .then((data) => setTestCases(data))
      .catch((error) => console.error('Error fetching test cases:', error));
  }, []);

  return (
    <div className={styles.testCases}>
      <ExecuteTestCases testCases={testCases} setTestCases={setTestCases} />
    </div>
  );
}