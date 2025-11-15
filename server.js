const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post("/usuarios", async (req, res) => {
  try {
    const { nome, dataNascimento, statusCivil, cpf, telefone } = req.body;

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        dataNascimento: new Date(dataNascimento), // <<< AQUI ESTÁ O TRUQUE
        statusCivil,
        cpf,
        telefone,
      },
    });

    res.json(usuario);

  } catch (error) {
    console.log(error);
    res.status(400).json({ erro: error.message });
  }
});



// 📋 Listar todos
app.get("/usuarios", async (req, res) => {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
});

// 🔍 Buscar por ID
app.get("/usuarios/:id", async (req, res) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id: Number(req.params.id) },
  });
  res.json(usuario);
});

// ✏️ Atualizar
app.put("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// ❌ Deletar
app.delete("/usuarios/:id", async (req, res) => {
  await prisma.usuario.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ message: "Usuário deletado com sucesso!" });
});

// Iniciar servidor
app.listen(3000, () => console.log("API rodando na porta 3000"));
