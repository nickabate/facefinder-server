const express = require("express");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.json());

const database = {
  users: [
    {
      id: "123",
      name: "Nick",
      email: "email",

      entries: 0,
      joined: new Date(),
    },
    {
      id: "1213",
      name: "Nick",
      email: "email",

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
    // req.body.password === database.users[0].password
    bcrypt.compareSync(
      req.body.password,
      database.users[database.users.length - 1].password
    )
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

app.listen(3000, () => {
  console.log(`Server is running...`);
});
