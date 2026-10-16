import express from "express"
import {authenticationMiddleware} from '../middlewares/auth.middleware.js'
import {getCoordinateController,distanceTimeContoller,getSuggestionController} from '../contollers/map.controller.js'
import { query } from "express-validator"
const router =express.Router()


router.get('/get-coordinates',
    query('address').isString().isLength({min:3}),
    authenticationMiddleware,
    getCoordinateController)


router.get('/get-distance-time',[
    query('origin').isString().isLength({min:3}).withMessage('Oringin should me atleast 3 character Long'),
    query('destination').isString().isLength({min:3}).withMessage('Destination should me atleast 3 character Long')
],authenticationMiddleware,distanceTimeContoller)

router.get('/get-suggestions',
    query('input').isString().isLength({min:3}).withMessage('Input should be atleast of 3 character'),
    authenticationMiddleware,getSuggestionController
)

export default router