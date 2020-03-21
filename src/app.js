const express = require('express')
const {
  getTodo,
  getAllTodos,
  createTodo,
  deleteTodo
} = require('./controller')

const app = express()
app.locals.dataFilePath = "./data.json"

const port = 3000

app.use(express.json())
app.get('/', (req, res) => res.send('<h1>Hi, Welcome!</h1>'))

app.get("/api/tasks/:id", getTodo)
app.get("/api/tasks", getAllTodos)

app.post("/api/tasks", createTodo)


app.delete("/api/tasks/:id", deleteTodo)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

exports.app = app
