import 'dotenv/config'
import express from 'express'
import pkg from '@prisma/client'

const { PrismaClient } = pkg
const prisma = new PrismaClient()
const app = express()
app.use(express.json())

app.post('/usuarios', async (req, res) => {
  try {
    const { email, name, age } = req.body
    const user = await prisma.user.create({
      data: { email, name, age }
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/usuarios', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/usuarios/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const { email, name, age } = req.body
    const data = {}
    if (email !== undefined) data.email = email
    if (name !== undefined) data.name = name
    if (age !== undefined) data.age = age

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' })
    }

    const user = await prisma.user.update({
      where: { id },
      data
    })
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.delete('/usuarios/:id', async (req, res) => {
  await prisma.user.delete({
    where: { id: Number(req.params.id) }
  })
  res.status(204).send()
})

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Porta ${PORT} já está em uso. Altere a variável PORT ou pare o outro processo.`)
  } else {
    console.error(error)
  }
})