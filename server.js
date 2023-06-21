const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "postgres",
    password: "rootroot",
    database: "facefinder",
  },
});

console.log(db.select().from("users"));

app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "Nick",
      email: "email",
      password: "pw",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "1213",
      name: "Nick",
      email: "email2",
      password: "pw2",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "123",
      password: "Nick",
      email: "email",
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
    // bcrypt.compareSync(req.body.password, database.users[0].password)
  ) {
    res.json("success");
  } else {
    res.status(400).json("error");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: bcrypt.hashSync(password),
    entries: 0,
    joined: new Date(),
  });
  console.log(database.users[database.users.length - 1]);
  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("user not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  console.log(id);

  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("user not found");
  }
});

app.listen(8080, () => {
  console.log(`Server is running...`);
});
