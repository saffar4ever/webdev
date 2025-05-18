import ExecuteTestCases from '@/components/ExecuteTestCases';
import { useState, useEffect } from 'react';
import styles from '@/styles/TestCases.module.css';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode('0959d63f029763711d4f26862cfcc5a8efbf9ba8ecf257ab57ec2e0bb3a3fe78');

export default function Execute() {
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        // Retrieve the token from cookies
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          console.error('No token found');
          return;
        }

        // Verify the token and extract the userId
        const { payload } = await jwtVerify(token, SECRET_KEY);
        const userId = payload.id;

        // Fetch test cases for the current user
        const response = await fetch(`/api/testCases?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch test cases');
        const data = await response.json();
        
        // Filter to only include unexecuted test cases
        const unexecutedTestCases = data.filter(testCase => !testCase.executed);
        setTestCases(unexecutedTestCases);
      } catch (error) {
        console.error('Error fetching test cases:', error);
      }
    };

    fetchTestCases();
  }, []);

  return (
    <div className={styles.testCases}>
      <ExecuteTestCases testCases={testCases} setTestCases={setTestCases} />
    </div>
  );
}