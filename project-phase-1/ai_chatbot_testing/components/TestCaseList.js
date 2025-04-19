import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "@/styles/TestCases.module.css";

export default function TestCaseList({ onEdit }) {
  const [testCases, setTestCases] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch test cases from the API
    fetch('/api/testCases')
      .then((response) => response.json())
      .then((data) => setTestCases(data))
      .catch((error) => console.error('Error fetching test cases:', error));
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
        setTestCases(testCases.filter((testCase) => testCase.ID !== id));
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
              <tr key={testCase.ID}>
                <td>{testCase.ID}</td>
                <td>{testCase.Prompt}</td>
                <td>{testCase.Truth}</td>
                <td>{testCase.Response}</td>
                <td>{testCase.Executed ? 'Yes' : 'No'}</td>
                <td>{testCase.Analysis}</td>
                <td>
                  <button onClick={() => router.push(`/addEditTestCase?id=${testCase.ID}`)}>Edit</button>
                  <button onClick={() => handleDelete(testCase.ID)}>Delete</button>
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