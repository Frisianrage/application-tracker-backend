const express = require('express')
const {createNewEmployer, getAllEmployer, getEmployerById, updateEmployerProfile, deleteEmployer} = require('./controller/employerController')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').get(protect, getAllEmployer).post(protect, createNewEmployer)
router.route('/profile/:id').get(protect, getEmployerById).post(protect, updateEmployerProfile).delete(protect, deleteEmployer)

module.exports = router