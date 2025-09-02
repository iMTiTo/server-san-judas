import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.status(202).json({
    msg: "Hola Mundo"
  })
  console.log("Dentro del get")
})

app.listen(3000)