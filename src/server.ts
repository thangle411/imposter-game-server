import express, { Request, Response } from 'express';
import seenWords from './routes/seenWords.ts';
import cors from 'cors';

const app = express();
const port = 3000;


// middleware
app.use(cors(
    {
        origin: 'https://imposter-game-tl.netlify.app'
    }
));
app.use(express.json());

// routes
app.use('/api/1/seen-words', seenWords);


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
