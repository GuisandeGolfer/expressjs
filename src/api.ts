import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import cors from 'cors';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI
});

const openai = new OpenAIApi(configuration);

export const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

// Healthcheck endpoint
app.get('/', (_req, res) => {
  res.status(200).send({ status: 'ok' });
});

const api = express.Router();

api.get('/hello', (_req, res) => {
  res.status(200).send({ message: 'hello world' });
});

api.get('/dream', (_req, res) => {
  res.status(200).send({ message: 'hello world' });
});

app.post('/dream', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const aiResponse = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024'
    });

    const image = aiResponse.data.data[0].url;
    res.send({ image });
  } catch (error) {
    console.log(error);
    res.status(500).send('something went wrong.');
  }
  // error?.response.data.error.message // optional chaining not working with typescript, mean to be in send().
});

// Version the api
app.use('/api/v1', api);
