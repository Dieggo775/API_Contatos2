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