const HttpError = require("../models/HttpError");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, "-password");
    } catch (err) {
        return next(
            new HttpError("Fetching users failed, please try again later.", 500)
        );
    }
    res.status(200).json({
        users: users.map((user) => user.toObject({ getters: true })),
    });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }
    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return next(
            new HttpError("SignUp failed. Please try again later.", 500)
        );
    }

    if (existingUser) {
        return next(
            new HttpError("User already exists, please login instead.", 422)
        );
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        return next(
            new HttpError("could not create user, please try again later.", 500)
        );
    }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        image: req.file.path,
        places: [],
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            "Signing up failed, please try again later.",
            500
        );
        return next(error);
    }

    let token;

    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            "supersecret_dont_share",
            { expiresIn: "1hr" }
        );
    } catch (err) {
        const error = new HttpError(
            "Signing up failed, please try again later.",
            500
        );
        return next(error);
    }

    res.status(200).json({
        userId: createdUser.id,
        email: createdUser.email,
        token: token,
    }); // converting a mongoose object to js object.
};

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return next(
            new HttpError("Login failed. Please try again later.", 500)
        );
    }

    if (!existingUser) {
        return next(
            new HttpError(
                "Could not find any user, credentials seem to be wrong.",
                403
            )
        );
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        return next(
            new HttpError(
                "Could not log you in, please check your credentials and try again.",
                500
            )
        );
    }

    if (!isValidPassword) {
        return next(
            new HttpError(
                "Could not find any user, credentials seem to be wrong.",
                403
            )
        );
    }

    let token;

    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            "supersecret_dont_share",
            { expiresIn: "1hr" }
        );
    } catch (err) {
        const error = new HttpError(
            "Logging in failed, please try again later.",
            500
        );
        return next(error);
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token,
    });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
