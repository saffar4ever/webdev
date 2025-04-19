import styles from '@/styles/TestCases.module.css'; // Import the CSS module

export default function ExecuteTestCases({ testCases, setTestCases }) {
  const hasPendingCases = testCases.some((testCase) => !testCase.Executed);

  const handleExecuteAll = () => {
    const randomString = () => Math.random().toString(36).substring(2, 15);

    const updatedTestCases = testCases.map((testCase) =>
      !testCase.Executed
        ? {
            ...testCase,
            Response: randomString(),
            Executed: true,
            Analysis: randomString(),
          }
        : testCase
    );

    setTestCases(updatedTestCases);

    fetch('/api/testCases', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTestCases),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to execute test cases');
        return response.json();
      })
      .then(() => console.log('Pending test cases executed successfully'))
      .catch((error) => console.error('Error executing test cases:', error));
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Execute Test Cases</h2>
      <br />
      {/* Button always visible */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button
          onClick={handleExecuteAll}
          className={styles.addButton}
          disabled={!hasPendingCases} // Disable button if no pending test cases
          style={{
            backgroundColor: hasPendingCases ? '#007bff' : '#d3d3d3', // Gray out if disabled
            cursor: hasPendingCases ? 'pointer' : 'not-allowed',
          }}
        >
          Execute PENDING Test Cases
        </button>
      </div>
      {/* Conditional rendering for test cases */}
      {testCases.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'gray' }}>No test cases available.</p>
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
            {testCases.map((testCase) => (
              <tr key={testCase.ID}>
                <td>{testCase.ID}</td>
                <td>{testCase.Prompt}</td>
                <td>{testCase.Truth}</td>
                <td>{testCase.Response}</td>
                <td>{testCase.Executed ? 'Yes' : 'No'}</td>
                <td>{testCase.Analysis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}