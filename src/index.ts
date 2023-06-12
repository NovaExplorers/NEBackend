import express from "express";
import dotenv from 'dotenv'

import { initDb } from '@utils/database';
import { authRouter } from '@routes/Auth.routes';

import cors from 'cors';
import morgan from 'morgan';
import expressSession from 'express-session';
import { deviceRouter } from "@routes/Device.routes";
import { initServer } from "socket/socketServer";

const MongoDBStore = require('connect-mongodb-session')(expressSession);

dotenv.config()


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'))
app.use(expressSession({
    secret: process.env.SESSION_SECRET!,
    store: new MongoDBStore({
        uri: process.env.DB_URL,
        collection: 'sessions',
        connectionOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            sslValidate: false,
        }
    })
}))

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
   })
);

initDb();

initServer()

app.use(authRouter);
app.use(deviceRouter);

app.listen(8080, () => {
    console.log("Skylinker API - Listening on port 8080");
});
