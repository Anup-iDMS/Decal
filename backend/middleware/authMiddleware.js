import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'
import User from '../models/master/userModel.js';


const protect = asyncHandler(async (req, res, next) => {

    //console.log(">>>> Inside protect middleware and printing headers authorization ")

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
         try {
            token = req.headers.authorization.split(' ')[1]
            //console.log("Printing token ", token)
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            //console.log("Printing decoded ", decoded)
            req.user = await User.findById(decoded.id).select('-password')
            next();
         } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
         }
     } else {
        throw new Error('Not authorized, token failed')
     }

});

const admin = (req, res, next) => {
    //console.log("+++++ Inside function to check admin user........ ", req.user)
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as Admin')
    }
}

const superAdmin = (req, res, next) => {
    //console.log("....... Inside function to check SUPER admin user........ ", req.user)
    if (req.user && req.user.isAdmin && req.user.isSuperAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as Admin')
    }
}

export {protect, admin, superAdmin}