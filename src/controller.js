const fs = require("fs")

const {
  asyncReadFile,
  asyncWriteFile
} = require('./dao')

exports.getTodo = async (req, res) => {
  const id = req.params.id
  const file = await asyncReadFile(req.app.locals.dataFilePath)
  const todo = JSON.parse(file).filter(v => v.id === id)
  todo.length == 0 ? res.status(404).send() : res.send(todo[0])
}

exports.getAllTodos = (req, res) => fs.readFile(req.app.locals.dataFilePath, "utf-8", (err, data) => {
  if (err) {
    return res.status(500).send()
  }
  res.send(JSON.parse(data))
})

exports.createTodo = async (req, res) => {
  const newTodo = req.body
  const file = await asyncReadFile(req.app.locals.dataFilePath)
  const todos = JSON.parse(file)
  if (todos.filter(v => v.id === newTodo.id).length != 0) {
    res.status(400).send()
  } else {
    todos.push(newTodo)
    await asyncWriteFile(JSON.stringify(todos), req.app.locals.dataFilePath)
    res.status(201).send(todos)
  }
}


exports.deleteTodo = async (req, res) => {
  const id = req.params.id
  const file = await asyncReadFile(req.app.locals.dataFilePath)
  const todos = JSON.parse(file)
  const newTodo = todos.filter(v => v.id !== id)
  if (newTodo.length === todos.length) {
    res.status(404).send()
  } else {
    await asyncWriteFile(JSON.stringify(newTodo), req.app.locals.dataFilePath)
    res.status(204).send()
  }

}
