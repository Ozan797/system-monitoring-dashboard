import express from 'express';
import performanceRoutes from './routes/performance';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', performanceRoutes);

// Basic testing route
app.get('/', (req, res) => {
  res.send('Backend is up and running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
