// controllers/usersController.js
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const memberStorage = require("../storages/memberStorage");
const pool = require('../db/pool')
const bcrypt = require('bcryptjs')
const passport = require("passport");

exports.usersListGet = async (req, res) => {

    const messages = await db.getAllMessage()

    res.render("index", {
        title: "User list",
        user: req.user,
        messages: messages
    });

};

exports.usersCreateGet = (req, res) => {
    res.render("createUser", {
      title: "Create user",
    });
  };


const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const validateUser = [
    body("firstName").trim()
      .isAlpha().withMessage(`First name ${alphaErr}`)
      .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
    body("lastName").trim()
      .isAlpha().withMessage(`Last name ${alphaErr}`)
      .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
    body("password").isLength({min: 5}).withMessage("password must have more than 5 words"),
    body("passwordConfirmation").custom((value, { req }) => {
        return req.body.password === req.body.passwordConfirm
    }).withMessage("confirmPassword is different from password"),
  ];


exports.usersCreatePost = [
    validateUser,
    async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {

            return res.render('createUser', {
                title: "something go wrong nigga",
                errors: errors.array()
            })

        }

        try {

            const { firstName, lastName, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
    
            await pool.query("INSERT INTO members (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)", [
                firstName,
                lastName,
                email,
                hashedPassword,
            ]);

            req.session.user = { firstName, lastName , email  }
            res.redirect("/secret");
    
        } catch (err) {
    
            return next(err)
    
        }
    }
]

exports.usersSecretGet = (req, res) => {

    const user = req.session.user
    if (!user) return res.redirect('/create')

    res.render("secret", {
      title: "Verify user",
      user: user
    });

  };

const validateAnswer = [
    body("answer").custom((value, { req }) => {
        console.log(req.body.answer)
        return req.body.answer === "first rule"
    })
]

exports.usersSecretPost = [
    validateAnswer,
    async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {

            return res.render('createUser', {
                title: "something go wrong nigga",
                errors: errors.array()
            })

        }

        try {
            
            const user = req.session.user
    
            await pool.query("UPDATE members SET status = true WHERE email = $1", [
                user.email
            ])

            const is_Admin = req.body.admin === "on" ? true : false

            if (is_Admin === true) {
                await pool.query("UPDATE members SET is_admin = true WHERE email = $1", [
                    user.email
                ])
            }
    
            res.redirect("/");
    
        } catch (err) {
    
            return next(err)
    
        }
    }
]

exports.usersLoginGet = (req, res) => {

    res.render("login")

};

exports.usersLoginPost = (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })(req, res, next);

}

exports.usersLoginOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    })
}

exports.usersCreateMessageGet = (req, res) => {
    res.render('createMessage', {
        title: "Create Message"
    })
}

exports.usersCreateMessagePost = async (req, res, next) => {

    try {

        console.log(req.body.title)
        console.log(req.body.description)

        const newMessage = {
            userId: req.user.id,
            title: req.body.title,
            description: req.body.description,
            date: new Date()
        }

        console.log(newMessage)

        await pool.query("INSERT INTO messages (userId, title, description, date) VALUES ($1, $2, $3, $4)", [
            newMessage.userId,
            newMessage.title,
            newMessage.description,
            newMessage.date,
        ]);

        res.redirect("/");

    } catch (err) {

        return next(err)

    }
}

exports.usersDeleteMessagePost = async (req, res, next) => {

    try {

        console.log(req.body.messageid)
        const messageId = req.body.messageid

        await pool.query("DELETE FROM messages WHERE id = $1", 
            [messageId]
        );

        res.redirect("/");

    } catch (err) {

        return next(err)

    }
}