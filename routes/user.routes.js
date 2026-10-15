import express from 'express'
import { body} from 'express-validator'
import {userRegistreController,loginController,getUserProfileController} from '../contollers/user.controller.js'
import { authenticationMiddleware } from '../middlewares/auth.middleware.js'
const router =express.Router()

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullName.firstName').isLength({min:3}).withMessage('First name be atleast 3 charater long'),
    body('password').isLength({min:6}).withMessage('Password should be at at leat 6 character long')
],userRegistreController)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password should be at at leat 6 character long')
],loginController)


router.get('/profile',authenticationMiddleware,getUserProfileController)


export default router