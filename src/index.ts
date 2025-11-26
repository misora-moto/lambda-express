import express from 'express';
import type { Request, Response } from 'express';
import serverlessHttp from 'serverless-http';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!!' });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/users', (req: Request, res: Response) => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];
  res.json(users);
});

app.post('/api/users', (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }
  res.status(201).json({ id: Date.now(), name });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Lambda handler for AWS Lambda Function URL
export const handler = serverlessHttp(app);

// Local development server
if (process.env.NODE_ENV !== 'production' || !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
