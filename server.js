const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "rootroot",
    database: "facefinder",
  },
});

app.use(express.json());
app.use(cors());

// const database = {
//   users: [
//     {
//       id: "123",
//       name: "Nick",
//       email: "email",
//       password: "pw",
//       entries: 0,
//       joined: new Date(),
//     },
//     {
//       id: "1213",
//       name: "Nick",
//       email: "email2",
//       password: "pw2",
//       entries: 0,
//       joined: new Date(),
//     },
//   ],
//   login: [
//     {
//       id: "123",
//       password: "Nick",
//       email: "email",
//     },
//   ],
// };

app.get("/", (req, res) => {
  res.send("Success");
});

app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("Unable to get user"));
      } else {
        res.status(400).json("Wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("Wrong credentials"));
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  // database.users.push({
  //   id: "125",
  //   name: name,
  //   email: email,
  //   password: bcrypt.hashSync(password),
  //   entries: 0,
  //   joined: new Date(),
  // });
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch((err) => res.status(400).json("Unable to register."));
  }).catch((err) => res.status(400).json("Unable to register."));
  // console.log(database.users[database.users.length - 1]);
  // res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  // let found = false;
  // database.users.forEach((user) => {
  //   if (user.id === id) {
  //     found = true;
  //     return res.json(user);
  //   }
  // });
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch((err) => {
      res.status(400).json("Error getting user");
    });
  // if (!found) {
  //   res.status(400).json("user not found");
  // }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  // console.log(id);
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("Unable to get info"));
});

app.listen(8080, () => {
  console.log(`Server is running...`);
});
