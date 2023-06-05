import express from "express";
import cors from 'cors';
import { initDb } from '@utils/database';
import { authRouter } from '@routes/Auth.routes';
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
await initDb();
app.use(authRouter);
app.listen(8080, () => {
    console.log("Skylinker API - Listening on port 8080");
});
