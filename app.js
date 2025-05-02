// app.js

const path = require("node:path");


const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./db/pool')
const membersRouter = require('./routes/membersRouter')
const bcrypt = require('bcryptjs')

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const { rows } = await pool.query("SELECT * FROM members WHERE email = $1", [email]);
        const user = rows[0];

        
  
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        console.log(user)
        return done(null, user);

      } catch(err) {
        return done(err);
      }
    })
  );

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
passport.deserializeUser(async (id, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM members WHERE id = $1", [id]);
      const user = rows[0];
  
      done(null, user);
    } catch(err) {
      done(err);
    }
  });

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use("/", membersRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));




// const message = {
//     id: Number,
//     userId: Number,
//     title: String,
//     description: "text",
//     date: Date
// }



