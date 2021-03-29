import 'dotenv/config'
import { Schema, model } from "mongoose";
import Joi from 'joi'
import { sign } from "jsonwebtoken";
import { RegisterContext } from '../auth/auth.model';

const userSchema = new Schema({
    email: String,
    pass: String,
    role: { type: Array, default: new Array() },
    date: { type: Date, default: Date.now },
    employId: Number,
    firstName: String,
    lastName: String,
    class: String,
    job: String,
    phone: Number
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
const validateUser = (_user: RegisterContext) => {
    const schema = Joi.object({
        employId: Joi.number().min(0).max(80).required(),
        pass: Joi.string().min(0).max(80).required(),
        firstName: Joi.string().min(0).max(80).required(),
        lastName: Joi.string().min(0).max(80).required(),
        class: Joi.string().min(0).max(80).required(),
        job: Joi.string().min(0).max(80).required(),
        phone: Joi.number().min(500000000).max(559999999).required(),
        email: Joi.string().min(5).max(80).email().required(),
        role: Joi.array()
    })
    return schema.validate(_user)
}

const _validateUser = validateUser;
export { _validateUser as validateUser };

