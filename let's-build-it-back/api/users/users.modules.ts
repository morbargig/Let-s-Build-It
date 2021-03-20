import 'dotenv/config'
import { Schema, model } from "mongoose";
import Joi from 'joi'
import { sign } from "jsonwebtoken";

const userSchema = new Schema({
    email: String,
    pass: String,
    role: { type: Array, default: new Array() },
    date: { type: Date, default: Date.now }
})

export const userModel = model("users", userSchema);

// create token for the data
const genUserToken = (_item) => {
    // generate new token with my secret 
    const token = sign(_item, process.env.TOKEN_SECRET);
    return token;
}

const _genUserToken = genUserToken;
export { _genUserToken as genUserToken };

// Validate User data with the DB schema
const validateUser = (_user) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(80).email().required(),
        pass: Joi.string().min(2).max(80).required(),
        role: Joi.array()
    })
    return schema.validate(_user)
}

const _validateUser = validateUser;
export { _validateUser as validateUser };

