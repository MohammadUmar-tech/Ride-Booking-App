import express from 'express'
import { captainAuthenticationMiddleware } from '../middlewares/auth.middleware.js'
import { createCaptainController, getCaptainProfile,captainLoginController } from '../contollers/captain.controller.js'
import { body } from 'express-validator'
const router =express.Router()

router.post('/register',[

    body('email').isEmail().withMessage('Invalid Email'),
    body('fullName.firstName').isLength({min:3}).withMessage('FirstName must be of 3 charcter'),
    body('password').isLength({min:3}).withMessage('Password should be of atleast 6 character'),
    body('vehicle.color').isLength({min:3}).withMessage('Color must be 3 character long'),
    body('vehicle.plate').isLength({min:3}).withMessage('Plate must be 3 character long'),
    body('vehicle.capacity').isInt({min:1}).withMessage('Capacity must be 1 character long'),
    body('vehicle.vehicleType').isIn(['car','motorcycle','auto']).withMessage('Color must be 3 character long')

],createCaptainController)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    captainLoginController
)

router.get('/profile',captainAuthenticationMiddleware,getCaptainProfile)

router.get('/logout',captainAuthenticationMiddleware,)



export default router