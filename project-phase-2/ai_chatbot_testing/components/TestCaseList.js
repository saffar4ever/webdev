import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "@/styles/TestCases.module.css";
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode('0959d63f029763711d4f26862cfcc5a8efbf9ba8ecf257ab57ec2e0bb3a3fe78');

export default function TestCaseList({ onEdit }) {
  const [testCases, setTestCases] = useState([]);
  const router = useRouter();

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

        // Fetch test cases for the logged-in user
        const response = await fetch(`/api/testCases?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch test cases');
        const data = await response.json();
        setTestCases(data);
      } catch (error) {
        console.error('Error fetching test cases:', error);
      }
    };

    fetchTestCases();
  }, []);

  const handleAddTestCase = () => {
    router.push('/addEditTestCase'); // Navigate to the Add Test Case page
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this test case?');
    if (!confirmDelete) return;

    fetch('/api/testCases', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ID: id }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete test case');
        return response.json();
      })
      .then(() => {
        setTestCases(testCases.filter((testCase) => testCase.id !== id));
      })
      .catch((error) => console.error('Error deleting test case:', error));
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Test Cases List</h2>
      <br />
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={handleAddTestCase} className={styles.addButton}>
          Add Test Case
        </button>
      </div>
      {testCases.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Prompt</th>
              <th>Truth</th>
              <th>Response</th>
              <th>Executed?</th>
              <th>Analysis</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((testCase) => (
              <tr key={testCase.id}>
                <td>{testCase.id}</td>
                <td>{testCase.prompt}</td>
                <td>{testCase.truth}</td>
                <td>{testCase.response}</td>
                <td>{testCase.executed ? 'Yes' : 'No'}</td>
                <td>{testCase.analysis}</td>
                <td>
                  <button onClick={() => router.push(`/addEditTestCase?id=${testCase.id}`)}>Edit</button>
                  <button onClick={() => handleDelete(testCase.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', color: 'gray' }}>No test cases available.</p>
      )}
    </div>
  );
}