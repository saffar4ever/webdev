import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'testCases.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = fs.readFileSync(filePath, 'utf8');
    res.status(200).json(JSON.parse(data));
  } else if (req.method === 'POST') {
    const newTestCase = req.body;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.push(newTestCase);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.status(201).json({ message: 'Test case added successfully' });
  } else if (req.method === 'PATCH') {
    try {
      // Read the existing data
      const fileData = fs.readFileSync(filePath, 'utf8');
      const testCases = JSON.parse(fileData);

      // Check if the request body is an array (for executing multiple test cases)
      if (Array.isArray(req.body)) {
        const updatedTestCases = req.body;

        // Update each test case in the array
        updatedTestCases.forEach((updatedTestCase) => {
          const index = testCases.findIndex(tc => tc.ID === updatedTestCase.ID);
          if (index !== -1) {
            testCases[index] = { ...testCases[index], ...updatedTestCase };
          }
        });

        // Write the updated data back to the file
        fs.writeFileSync(filePath, JSON.stringify(testCases, null, 2), 'utf8');

        res.status(200).json({ message: 'Test cases executed successfully' });
      } else {
        // Handle a single test case update (for editing)
        const updatedTestCase = req.body;

        // Find the index of the test case to update
        const index = testCases.findIndex(tc => tc.ID === updatedTestCase.ID);

        if (index === -1) {
          return res.status(404).json({ message: 'Test case not found' });
        }

        // Update the specific test case
        testCases[index] = { ...testCases[index], ...updatedTestCase };

        // Write the updated data back to the file
        fs.writeFileSync(filePath, JSON.stringify(testCases, null, 2), 'utf8');

        res.status(200).json({ message: 'Test case updated successfully' });
      }
    } catch (error) {
      console.error('Error updating test cases:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    const { ID } = req.body;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updatedData = data.filter((testCase) => testCase.ID !== ID);
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    res.status(200).json({ message: 'Test case deleted successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}