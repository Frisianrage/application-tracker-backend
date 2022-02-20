const express = require('express')
const {createNewEmployer, getAllMyEmployer, getEmployerById, updateEmployerProfile, deleteEmployer} = require('./controller/employerController')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(protect, createNewEmployer)
router.get('/:keyword', protect, getAllMyEmployer)
router.route('/profile/:id').get(protect, getEmployerById).post(protect, updateEmployerProfile).delete(protect, deleteEmployer)

module.exports = router