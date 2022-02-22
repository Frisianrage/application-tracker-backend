const express = require('express')
const {createNewEmployer, getAllMyEmployer, getEmployerById, updateEmployerProfile, deleteEmployer, searchEmployer} = require('./controller/employerController')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(protect, createNewEmployer).get(protect, getAllMyEmployer)
router.get('/search/:keyword', protect, searchEmployer)
router.route('/profile/:id').get(protect, getEmployerById).post(protect, updateEmployerProfile).delete(protect, deleteEmployer)

module.exports = router