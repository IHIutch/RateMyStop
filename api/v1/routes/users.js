const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User } = require("../models/index");

router.get("/", (req, res) => {
  res.json({ user: { email: "jbhutch01@gmail.com" } });
});

router.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "undefined" && typeof password !== "undefined") {
    User.findOne({
      where: {
        email: email,
      },
    }).then((user) => {
      if (user) {
        return res.sendStatus(404).json({ error: "That email already exists" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;

            User.create({
              email: email,
              password: hash,
            })
              .then(res.sendStatus(201))
              .catch((err) => console.log(err));
          });
        });
      }
    });
  } else {
    return res.sendStatus(404).json({ error: "Email and password required" });
  }
});

module.exports = router;