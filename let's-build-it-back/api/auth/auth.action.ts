import { Router } from 'express';
const router = Router();
import { userModel, validateUser, genUserToken } from "../users/users.modules";
import { genSalt, hash, compare } from "bcrypt";
import { User } from '../users/user.model'
import { LoginContext, RegisterContext, AuthorizationEntity } from '../auth/auth.model';

// add new user
router.post("/register", async (req, res) => {
    let registerData: RegisterContext = req.body
    let validUser = await validateUser(registerData);
    if (validUser.error) {
        return res.status(400).json(validUser.error.details[0]);
    }
    // encryption standard
    const salt = await genSalt(10);
    // password encryption
    registerData.pass = await hash(registerData.pass, salt);
    try {
        let saveData = await userModel.insertMany([req.body]);
        // res.json( pick(saveData[0], ["_id", ...Object.keys(loginData)])
        let user: User = saveData?.[0] as any
        let newToken = genUserToken({ _id: user._id, employId: user.employId });
        let expiresDate: Date = new Date()
        expiresDate.setFullYear(new Date().getFullYear() + 1)
        let authObj: AuthorizationEntity = {
            employId: user.employId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            authorized: true,
            expiresIn: expiresDate,
            accessToken: newToken,
            admin: user?.role.includes('admin'),
        }
        res.json(authObj)
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ message: "error can't create new user" })
    }
})

router.post("/login", async (req, res) => {
    // find user by email
    req.body as LoginContext
    let user: User = await userModel.findOne({ employId: req.body.employId }) as any
    // check user ageists
    if (!!user) {
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
    let newToken = genUserToken({ _id: user._id, employId: user.employId });
    let expiresDate: Date = new Date()
    expiresDate.setFullYear(new Date().getFullYear() + 1)
    let authObj: AuthorizationEntity = {
        employId: user.employId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        authorized: true,
        expiresIn: expiresDate,
        accessToken: newToken,
        admin: user?.role.includes('admin'),
    }
    res.json(authObj)
})

export default router;