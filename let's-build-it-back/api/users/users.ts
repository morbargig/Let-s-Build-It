import { Router } from 'express';
const router = Router();
import { userModel, validateUser, genUserToken } from "./users.modules";
import { genSalt, hash, compare } from "bcrypt";
import { User } from './user.model'
import { pick } from "lodash";
import auth from "../../auth/auth";



router.get('/admin', auth, async (req, res) => {
    // check for permission
    const { role } = (req as any).user;
    if (!role.includes('admin')) {
        return res.sendStatus(403);
    }
    // get the admin user, depends on that the admin is the first user
    userModel.findOne({ email: "morbargig@gmail.com" }, (err, data) => {
        res.json(data)
    })
})


// GET users listing. 
router.get('/users', (req, res, next) => {
    userModel.find({})
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.status(400).json(err)
        })

});

// add new user
router.post("/register", async (req, res) => {
    // first validate user data
    let validUser = await validateUser(req.body);
    if (validUser.error) {
        return res.status(400).json(validUser.error.details[0]);
    }
    // encryption standard
    const salt = await genSalt(10);
    // password encryption
    req.body.pass = await hash(req.body.pass, salt);
    try {
        let saveData = await userModel.insertMany([req.body]);
        res.json(pick(saveData[0], ["_id", "email", "date"]));
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "error insert new user, check email" })
    }
})

router.post("/login", async (req, res) => {
    // find user by email
    let user: User = await userModel.findOne({ email: req.body.email }) as any
    // check user ageists
    if (user) {
        // check user password, with coming encrypted password
        let validPass = await compare(req.body.pass, user.pass)

        // wrong password
        if (!validPass) return res.status(400).json({ message: "wrong password" })
    }
    else {
        // user don't ageists
        return res.status(400).json({ message: "No such user" })
    }
    // return generated token
    let newToken = genUserToken({ _id: user._id, email: user.email });
    res.json({ token: newToken })
})

export default router;