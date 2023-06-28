const handleRegister = (req, res, db, bcrypt) => {
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
};

module.exports = { handleRegister };
