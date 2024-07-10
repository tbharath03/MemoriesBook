const express = require("express");

const router = express.Router();
const usersController = require("../controllers/users-controller");
const fileUpload = require("../middleware/file-upload");
const { check } = require("express-validator");

router.get("/", usersController.getUsers);

router.post(
    "/signup",
    fileUpload.single("image"),
    [
        check("name").not().isEmpty(),
        check("email").normalizeEmail().isEmail(),
        check("password").isLength({ min: 8 }),
    ],
    usersController.signup
);

router.post(
    "/login",
    [
        check("email").normalizeEmail().isEmail(),
        check("password").isLength({ min: 8 }),
    ],
    usersController.login
);

module.exports = router;
