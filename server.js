const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();
const knex = require("knex");

const register = require("./controllers/register");
const signIn = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

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

//dependency injection so controller doesn't need to import modules
app.post("/signin", (req, res) => {
  signIn.handleSignIn(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.listen(8080, () => {
  console.log(`Server is running...`);
});
