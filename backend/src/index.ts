import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('Backend is up and running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
