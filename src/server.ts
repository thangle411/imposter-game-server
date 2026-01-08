import express, { Request, Response } from 'express';
import seenWords from './routes/seenWords';
import cors from 'cors';

const app = express();
const port = 3000;


// middleware
var whitelist = ['https://imposter-game-tl.netlify.app', 'http://localhost:5173']
const corsOptions = {
    origin: (origin: string | undefined, callback: Function) => {
        if (!origin) return callback(null, true)

        if (whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(null, true)
        }
    },
    credentials: true
}
app.use(cors(corsOptions));
app.use(express.json());

// routes
app.use('/api/1/seen-words', seenWords);


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});