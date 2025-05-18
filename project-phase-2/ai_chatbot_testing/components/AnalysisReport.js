import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode('0959d63f029763711d4f26862cfcc5a8efbf9ba8ecf257ab57ec2e0bb3a3fe78');

// Register required chart.js components and plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function AnalysisReport() {
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          console.error('No token found');
          return;
        }

        const { payload } = await jwtVerify(token, SECRET_KEY);
        const userId = payload.id;

        const response = await fetch(`/api/testCases?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setTestCases(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching test cases:', error);
      }
    };

    fetchTestCases();
  }, []);

  const executedCases = Array.isArray(testCases) ? testCases.filter((testCase) => testCase.executed) : [];
  const pendingCases = Array.isArray(testCases) ? testCases.filter((testCase) => !testCase.executed) : [];
  const totalCases = Array.isArray(testCases) ? testCases.length : 0;
  const executedPercentage = totalCases
    ? ((executedCases.length / totalCases) * 100).toFixed(2)
    : 0;
  const pendingPercentage = totalCases
    ? ((pendingCases.length / totalCases) * 100).toFixed(2)
    : 0;

  const pieData = {
    labels: ['Executed', 'Pending'],
    datasets: [
      {
        data: [executedCases.length, pendingCases.length],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#66bb6a', '#e57373'],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      datalabels: {
        color: '#fff',
        font: {
          size: 14,
          weight: 'bold',
        },
        formatter: (value) => value, // Display the raw value (number of test cases)
      },
    },
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Analysis Report</h2>
      <br />
      {totalCases === 0 ? (
        // Display this message if no test cases are available
        <p style={{ textAlign: 'center', color: 'gray' }}>No test cases available.</p>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
          {/* Left Side: Information */}
          <div style={{ flex: '0 1 auto', padding: '5px' }}>
            <p><strong>Executed Test Cases:</strong> {executedCases.length}</p>
            <p><strong>Execution Percentage:</strong> {executedPercentage}%</p>
            <br />
            <p><strong>Pending Test Cases:</strong> {pendingCases.length}</p>
            <p><strong>Pending Percentage:</strong> {pendingPercentage}%</p>
            <br />
            <p><strong>Total Test Cases:</strong> {totalCases}</p>
          </div>

          {/* Right Side: Pie Chart */}
          <div style={{ flex: '0 1 auto', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '250px', height: '250px' }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}