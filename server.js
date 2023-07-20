require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();
const knex = require("knex");

const PORT = process.env.PORT || 8080;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DATABASE_URL = process.env.DATABASE_URL;

const register = require("./controllers/register");
const signIn = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    // host: DB_HOST,
    // port: DB_PORT,
    // user: DB_USER,
    // password: DB_PASSWORD,
    // database: DB_DATABASE,
  },
});

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
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

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
