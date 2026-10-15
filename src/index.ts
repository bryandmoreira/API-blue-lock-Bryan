import http from "http";
import app from "./app";

// Cria o servidor HTTP usando as regras do app
const server = http.createServer(app);

// Define a porta do servidor
const PORT = process.env.PORT || 8080;

// Inicia o servidor
server.listen(PORT, () => console.info("Servidor escutando na porta ", PORT));