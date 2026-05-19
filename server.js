import express from 'express'

 const app = express()

 app.get('/usuarios', (req, res) => {
    res.send('Ola Mundo')
 })

 app.listen(3000)