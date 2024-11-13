const sqlite3 = require("sqlite3").verbose();

const todos = [
  { id: 1, task: "Learn Node.js", completed: false, priority: "low" },
  { id: 2, task: "Build a REST API", completed: false, priority: "low" },
];

// Create a new database file (or overwrite if it exists)
let db = new sqlite3.Database("todos.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the todos.db SQlite database.");
});

// Initialize the table and insert rows
db.serialize(() => {
  // Drop the table if it exists
  db.run("DROP TABLE IF EXISTS todos");

  // Create the table
  db.run(`CREATE TABLE todos (
    id INTEGER PRIMARY KEY,
    task TEXT,
    completed BOOLEAN,
    priority TEXT
  )`);

  // Insert the rows
  let stmt = db.prepare(
    "INSERT INTO todos (id, task, completed, priority) VALUES (?, ?, ?, ?)"
  );
  todos.forEach((todo) => {
    stmt.run(todo.id, todo.task, todo.completed, todo.priority);
  });
  stmt.finalize();
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Close the database connection.");
});
