import { Router } from "express";
import personagemController from "./controllers/personagens"
import funcionarioController from "./controllers/funcionario";
import { authentication } from "./middlewares/authentication"
import { isAdmin, isAdminOrHimself } from "./middlewares/permissions";


const routes = Router();

routes.get("/", (request, response) => {
    return response.status(200).json({ message: "Hello World!" });
});


routes.post("/login", funcionarioController.login);

routes.get("/personagens", authentication, personagemController.list)
routes.get("/personagens/:id", authentication, personagemController.getById);
routes.post("/personagens", authentication, personagemController.create);
routes.put("/personagens/:id", authentication, personagemController.update);
routes.delete("/personagens/:id", authentication, personagemController.delete);


routes.get("/funcionarios", authentication, isAdmin, funcionarioController.list)
routes.get("/funcionarios/:id", authentication, isAdminOrHimself, funcionarioController.getById);
routes.post("/funcionarios", authentication, isAdmin, funcionarioController.create);
routes.put("/funcionarios/:id", authentication, isAdminOrHimself, funcionarioController.update);
routes.delete("/funcionarios/:id", authentication, isAdmin, funcionarioController.delete);

export default routes;