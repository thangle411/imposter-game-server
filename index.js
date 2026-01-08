// Use "type: module" in package.json to use ES modules
import express from 'express';
const app = express();

// Define your routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express on Vercel!' });
});

app.listen(3000, () => {
    console.log(`Server is running on port ${port}`);
});