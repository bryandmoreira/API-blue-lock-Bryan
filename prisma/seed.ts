import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";

async function main() {
  const funcionario = await (prisma).funcionario.create({
    data: {
      nome: "Admin",
      email: "admin@gmail.com",
      cargo: "ADMIN",
      cpf: "12345678912",
      senha: bcrypt.hashSync("123456", +process.env.BCRYPT_ROUNDS!),
    },
  });

  console.info("Funcionário criado:", funcionario);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });