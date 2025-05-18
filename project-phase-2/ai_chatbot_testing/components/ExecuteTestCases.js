import styles from '@/styles/TestCases.module.css';
import { useState } from 'react';

export default function ExecuteTestCases({ testCases, setTestCases }) {
  const [isExecuting, setIsExecuting] = useState(false);
  const hasPendingCases = Array.isArray(testCases) && testCases.length > 0;

  const handleExecuteAll = async () => {
    if (!hasPendingCases || isExecuting) return;
    
    setIsExecuting(true);
    console.log('Executing all pending test cases...');
    
    // Create a copy of test cases for optimistic UI update
    const updatedTestCases = [...testCases];
    
    // Execute each test case one by one
    for (const testCase of testCases) {
      try {
        const response = await fetch('/api/testCases', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: testCase.id,
            operationType: 'simulate' // This tells the API to use random strings
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to execute test case ${testCase.id}`);
        }
        
        const updatedCase = await response.json();
        console.log(`Test case ${testCase.id} executed successfully:`, updatedCase);
      } catch (error) {
        console.error(`Error executing test case ${testCase.id}:`, error);
      }
    }
    
    // After all cases are executed, clear the list since we only show unexecuted cases
    setTestCases([]);
    setIsExecuting(false);
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Execute Test Cases</h2>
      <br />
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button
          onClick={handleExecuteAll}
          className={styles.addButton}
          disabled={!hasPendingCases || isExecuting}
          style={{
            backgroundColor: hasPendingCases && !isExecuting ? '#007bff' : '#d3d3d3',
            cursor: hasPendingCases && !isExecuting ? 'pointer' : 'not-allowed',
          }}
        >
          {isExecuting ? 'Executing...' : 'Execute PENDING Test Cases'}
        </button>
      </div>
      {Array.isArray(testCases) && testCases.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'gray' }}>No pending test cases available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Prompt</th>
              <th>Truth</th>
              <th>Response</th>
              <th>Executed?</th>
              <th>Analysis</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(testCases) &&
              testCases.map((testCase) => (
                <tr key={testCase.id}>
                  <td>{testCase.id}</td>
                  <td>{testCase.prompt}</td>
                  <td>{testCase.truth}</td>
                  <td>{testCase.response}</td>
                  <td>{testCase.executed ? 'Yes' : 'No'}</td>
                  <td>{testCase.analysis}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}