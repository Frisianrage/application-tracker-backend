const express = require('express')
const {registerNewUser, getAllUsers, loginUser, getUserProfile, updateUserProfile, deleteUser, getUserById, updateUser, addNewResume} = require('./controller/userController')
const {protect, admin} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(registerNewUser).get(protect, admin, getAllUsers)
router.post('/login', loginUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser)
router.put('/profile/resume', protect, addNewResume)

module.exports = router

