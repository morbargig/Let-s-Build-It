import 'dotenv/config'
import { verify } from "jsonwebtoken";
import { userModel } from "../api/users/users.modules";

const auth = (req, res, next) => {
    // get barber token
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    if (!token) {
        // no token found
        return res.status(400).json({ message: "You must send valid token! no token found" })
    }
    try {
        verify(token, process.env.TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            // overwrite user variable
            user = await userModel.findOne({ email: user.email, _id: user._id });
            if (!!user) {
                req.user = user;
                next();
            }
            else {
                // no user found
                return res.status(400).json({ message: "You must send valid token! no user found" })
            }
        });
    }
    catch (err) {
        // token invalid
        return res.status(400).json({ message: "You must send valid token! invalid token" })
    }
}

export default auth;

