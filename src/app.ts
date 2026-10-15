import express from "express";
import cors from "cors";
import routes from "./routes"

// Inicializa o express
const app = express();

// Define regras do servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Define as rotas do servidor
app.use(routes);

export default app;
