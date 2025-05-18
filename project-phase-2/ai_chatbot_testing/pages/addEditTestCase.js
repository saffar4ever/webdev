import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AddTestCaseForm from '@/components/AddTestCaseForm';
import EditTestCaseForm from '@/components/EditTestCaseForm';
import Link from 'next/link';
import styles from '@/styles/TestCases.module.css';

export default function AddTestCase() {
  const router = useRouter();
  const { id } = router.query; // Get the test case ID from the query parameter
  const [selectedTestCase, setSelectedTestCase] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch the test case data for the given ID
      fetch(`/api/testCases?id=${id}`) // Add the `id` query parameter
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setSelectedTestCase(data);
            console.log('Fetched Test Case:', data); // Debugging log
          } else {
            console.error('Test case not found:', data);
            setSelectedTestCase(null);
          }
        })
        .catch((error) => console.error('Error fetching test case:', error));
    }
  }, [id]);

  const handleSave = () => {
    alert('Test case saved successfully!');
    router.push('/testCases'); // Redirect back to the Test Cases page
  };

  return (
    <div className={styles.addTestCase}>
      {id ? (
        <EditTestCaseForm selectedTestCase={selectedTestCase} onSave={handleSave} />
      ) : (
        <AddTestCaseForm onSave={handleSave} />
      )}
      <br />
      <Link href="/testCases">
        <button className={styles.backButton}>Back to Test Cases</button>
      </Link>
    </div>
  );
}