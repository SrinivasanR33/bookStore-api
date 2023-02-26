const express = require('express')
const router = express.Router()
const usersController = require('../controller/userController')
const verifyJWT = require('../middelware/verfiyjwt')

router.use(verifyJWT)
router.post("/sendmail",usersController.SendUser)
router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .put(usersController.updateUser)
    .patch(usersController.deleteUser)

module.exports = router
