import { Router } from 'express';
const router = Router();
import { userModel } from "./users.modules";
import auth from "../auth/auth";



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


// // GET users listing. 
// router.get('/users', (req, res, next) => {
//     userModel.find({})
//         .then(data => {
//             res.json(data)
//         })
//         .catch(err => {
//             res.status(400).json(err)
//         })
// });

export default router;
