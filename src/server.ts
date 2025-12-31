import app from './app.js';
import prisma from './config/prisma.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    try {
      await prisma.$connect();
      console.log('Database connected');
      console.log(`Server running on port ${PORT}`);
      console.log(`Go to http://localhost:${PORT}/health`);
    } catch (error) {
      console.error('DB connection failed', error);
      process.exit(1);
    }
});