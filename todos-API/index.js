const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Question 1: Add a "Priority" Field to the To-Do API
// Sample data
// let todos = [
//   { id: 1, task: "Learn Node.js", completed: false, priority: "low" },
//   { id: 2, task: "Build a REST API", completed: false, priority: "low" },
// ];

// import db functions
const db = require("./db");

// GET /todos - Retrieve all to-do items
app.get("/todos", async (req, res) => {
  let todos;
  // get completed param that is either true or false
  const completed = req.query.completed;
  // filter based on the completed param
  if (completed == "true") {
    todos = await db.getAllTodos();
    todos = todos.filter((todo) => todo.completed == (completed === "true"));
    console.log(todos);
  } else {
    todos = await db.getAllTodos();
  }
  res.json(todos);
});

/* 
Q.3"
GET /todos - Retrieve all to-do items or filter by completed status.
after completing this part, you need to comment out the GET end point 
already implemented here to test this new GET endpoint! 
*/

// POST /todos - Add a new to-do item
app.post("/todos", async (req, res) => {
  const newTodo = {
    // id: todos.length + 1,
    task: req.body.task,
    completed: req?.body?.completed || false,
    priority: req.body.priority || "medium",
  };
  // todos.push(newTodo);
  // res.status(201).json(newTodo);
  res.status(201).json(await db.addTodo(newTodo));
});

/*
Question 2: Implement a "Complete All" Endpoint
example usage: 
curl -X PUT http://localhost:3000/todos/complete-all
*/
// PUT /todos/complete-all - Complete all to-do items
app.put("/todos/complete-all", async (req, res) => {
  const todos = await db.getAllTodos();
  if (!todos.length) {
    return res.status(404).send("No To-Do items found");
  }
  // todos.forEach((todo) => (todo.completed = true));
  // res.json(todos);
  for (const todo of todos) {
    await db.updateTodo(todo.id, { ...todo, completed: true });
  }
  const updatedTodos = await db.getAllTodos();
  res.json(updatedTodos);
});

// PUT /todos/:id - Update an existing to-do item
// curl -X PUT http://localhost:3000/todos/1 -H "Content-Type: application/json" -d "{\"task\":\"UNLEARN Node.js\"}"
app.put("/todos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  // const todo = todos.find((t) => t.id === id);
  const todo = await db.getTodoById(id);
  if (!todo) {
    return res.status(404).send("To-Do item not found");
  }
  // todo.task = req.body.task || todo.task;
  // todo.completed =
  //   req.body.completed !== undefined ? req.body.completed : todo.completed;
  // res.json(todo);
  const updatedTodo = {
    task: req.body.task || todo.task,
    completed:
      req.body.completed !== undefined ? req.body.completed : todo.completed,
    priority: req.body.priority || todo.priority,
  };
  await db.updateTodo(id, updatedTodo);
  res.json(updatedTodo);
});

// DELETE /todos/:id - Delete a to-do item
// curl -X DELETE http://localhost:3000/todos/1
app.delete("/todos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  // const index = todos.findIndex((t) => t.id === id);
  const todo = await db.getTodoById(id);
  if (!todo) {
    return res.status(404).send("To-Do item not found");
  }
  // todos.splice(index, 1);
  // res.status(204).send();
  await db.deleteTodo(id);
  res.status(204).send();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
