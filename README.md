# API-blue-lock-Bryan

## Usando a API no Postman

Inicie a API com `npm run dev` (por padrão, em `http://localhost:8080`).
O arquivo `.env` deve conter `DATABASE_URL`, `JWT_SECRET` e `BCRYPT_ROUNDS`.

1. Faça login com uma conta previamente cadastrada usando `POST /auth/login`:

   ```json
   {
     "email": "voce@example.com",
     "senha": "sua-senha"
   }
   ```

   Copie o campo `token` da resposta. A API não oferece cadastro público;
   a conta precisa ser criada previamente por um administrador.
2. Crie um time com `POST /times`, configurando `Authorization: Bearer <token>`:

   ```json
   {
     "nome": "Time Exemplo",
     "pais": "Japão",
     "tecnico": "Técnico Exemplo",
     "liga": "Liga Exemplo"
   }
   ```

3. Crie um personagem com `POST /personagens`, também com o token no cabeçalho.
   Use o `id` do time criado como `timeId`:

   ```json
   {
     "nome": "Jogador Exemplo",
     "idade": 17,
     "posicao": "Atacante",
     "habilidade": "Finalização precisa",
     "timeId": 1
   }
   ```

O token expira após uma hora; faça login novamente para obter outro.

Para criar uma conta diretamente no SQLite, `Usuario` aceita somente `email` e
`senha`. Como o login compara senhas com bcrypt, grave o hash da senha, não o
texto puro. Gere um hash no terminal com:

```sh
node -e "require('bcrypt').hash('sua-senha', 10).then(console.log)"
```

Depois, insira o e-mail e o hash retornado:

```sql
INSERT INTO Usuario (email, senha)
VALUES ('teste@gmail.com', '<hash-bcrypt-gerado>');
```