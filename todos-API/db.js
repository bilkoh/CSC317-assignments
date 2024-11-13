// const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const { Database } = require("sqlite3");

async function openDb() {
  return open({
    filename: "todos.db",
    driver: Database,
  });
}

async function getAllTodos() {
  const db = await openDb();
  try {
    const rows = await db.all("SELECT * FROM todos");
    return rows;
  } finally {
    await db.close();
  }
}

async function getTodoById(id) {
  const db = await openDb();
  try {
    const row = await db.get("SELECT * FROM todos WHERE id = ?", [id]);
    return row;
  } finally {
    await db.close();
  }
}

async function addTodo(todo) {
  const db = await openDb();
  try {
    const result = await db.run(
      "INSERT INTO todos (task, completed, priority) VALUES (?, ?, ?)",
      [todo.task, todo.completed, todo.priority]
    );
    return { id: result.lastID, ...todo };
  } finally {
    await db.close();
  }
}

async function updateTodo(id, todo) {
  const db = await openDb();
  try {
    await db.run(
      "UPDATE todos SET task = ?, completed = ?, priority = ? WHERE id = ?",
      [todo.task, todo.completed, todo.priority, id]
    );
    return { id, ...todo };
  } finally {
    await db.close();
  }
}

async function deleteTodo(id) {
  const db = await openDb();
  try {
    await db.run("DELETE FROM todos WHERE id = ?", [id]);
    return { id };
  } finally {
    await db.close();
  }
}

module.exports = {
  getAllTodos,
  getTodoById,
  addTodo,
  updateTodo,
  deleteTodo,
};
