const express = require('express')
const {createNewEmployer, getAllEmployer, getEmployerById, updateEmployerProfile, deleteEmployer} = require('./controller/userController')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(createNewEmployer).get(protect, getAllEmployer)
router.route('/profile/:id').get(protect, getEmployerById).post(protect, updateEmployerProfile).delete(protect, deleteEmployer)

module.exports = router