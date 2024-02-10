import express, { Application } from "express";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

import identify from "./controllers/indentify";

app.post("/identify", identify);

export default app;