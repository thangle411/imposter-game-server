import express, { Request, Response } from 'express';
import seenWords from './routes/seenWords';
import cors from 'cors';

const app = express();
const port = 3000;


// middleware
var whitelist = ['https://imposter-game-tl.netlify.app', 'http://localhost:5173']
var corsOptions = {
    // @ts-ignore
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions));
app.use(express.json());

// routes
app.use('/api/1/seen-words', seenWords);


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

export default app