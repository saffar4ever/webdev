import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  try {
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);
    console.log('Request Query:', req.query);
    console.log('Request Body:', req.body);

    console.log('Request method:', req.method); // Debug: Log the request method
    console.log('Request body:', req.body); // Debug: Log the request body

    if (req.method === 'GET') {
      const { id, userId } = req.query;

      console.log('GET request received with query:', { id, userId }); // Debug: Log the query parameters

      if (id) {
        // Fetch a single test case by ID
        const testCase = await prisma.testCase.findUnique({
          where: { id: parseInt(id, 10) },
        });

        console.log('Fetched test case:', testCase); // Debug: Log fetched test case
        return res.status(200).json(testCase);
      }

      if (userId) {
        // Fetch all test cases for a user
        const testCases = await prisma.testCase.findMany({
          where: { userId: parseInt(userId, 10) },
        });

        console.log('Fetched test cases:', testCases); // Debug: Log fetched test cases
        return res.status(200).json(testCases);
      }

      console.error('Validation error: Invalid query parameters'); // Debug: Log validation error
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    // Handle POST request: Create a new test case
    if (req.method === 'POST') {
      const { prompt, truth, response = '', executed = false, analysis = '', userId } = req.body;

      console.log('POST request received with data:', { prompt, truth, response, executed, analysis, userId }); // Debug: Log the parsed data

      if (!prompt || !truth || !userId) {
        console.error('Validation error: Missing required fields'); // Debug: Log validation error
        return res.status(400).json({ error: 'Prompt, truth, and userId are required' });
      }

      const newTestCase = await prisma.testCase.create({
        data: {
          prompt,
          truth,
          response,
          executed,
          analysis,
          userId: parseInt(userId, 10),
        },
      });

      console.log('New test case created:', newTestCase); // Debug: Log the created test case
      return res.status(201).json(newTestCase);
    }

    // Handle PATCH request: Use operationType to differentiate between edit and simulate
    if (req.method === 'PATCH') {
      const { id, operationType, ...data } = req.body;

      console.log('PATCH request received with data:', { id, operationType, ...data }); // Debug: Log the parsed data

      if (!id || !operationType) {
        console.error('Validation error: Missing ID or operationType'); // Debug: Log validation error
        return res.status(400).json({ error: 'Test case ID and operationType are required' });
      }

      if (operationType === 'simulate') {
        console.log('Simulating test case execution for ID:', id); // Debug: Log simulation operation
        const randomString = () => Math.random().toString(36).substring(2, 15);

        const updatedTestCase = await prisma.testCase.update({
          where: { id: parseInt(id, 10) },
          data: {
            response: randomString(),
            executed: true,
            analysis: randomString(),
          },
        });

        console.log('Test case simulated:', updatedTestCase); // Debug: Log the simulated test case
        return res.status(200).json(updatedTestCase);
      } else if (operationType === 'edit') {
        console.log('Editing test case for ID:', id); // Debug: Log edit operation
        const updatedTestCase = await prisma.testCase.update({
          where: { id: parseInt(id, 10) },
          data,
        });

        console.log('Test case edited:', updatedTestCase); // Debug: Log the edited test case
        return res.status(200).json(updatedTestCase);
      } else {
        console.error('Invalid operationType:', operationType); // Debug: Log invalid operationType
        return res.status(400).json({ error: 'Invalid operationType. Use "edit" or "simulate".' });
      }
    }

    // Handle DELETE request: Delete a test case
    if (req.method === 'DELETE') {
      const { ID } = req.body;

      console.log('DELETE request received with data:', { ID }); // Debug: Log the parsed data

      if (!ID) {
        console.error('Validation error: Missing ID'); // Debug: Log validation error
        return res.status(400).json({ error: 'Test case ID is required' });
      }

      await prisma.testCase.delete({
        where: { id: parseInt(ID, 10) },
      });

      console.log('Test case deleted successfully for ID:', ID); // Debug: Log successful deletion
      return res.status(200).json({ message: 'Test case deleted successfully' });
    }

    // Method not allowed
    console.error('Invalid method:', req.method); // Debug: Log invalid method
    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('Error in /execute API:', error);
    console.error('API error:', error); // Debug: Log unexpected errors
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}