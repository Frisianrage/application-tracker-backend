const express = require('express')
const {createNewEmployer, getAllMyEmployer, getEmployerById, updateEmployerProfile, deleteEmployer, searchEmployer, getAllEmployer} = require('./controller/employerController')
const {protect, admin} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(protect, createNewEmployer).get(protect, getAllMyEmployer)
router.get('/search/:keyword', protect, searchEmployer)
router.route('/profile/:id').get(protect, getEmployerById).put(protect, updateEmployerProfile).delete(protect, deleteEmployer)
router.route('/admin/employerlist').get(protect, admin, getAllEmployer)

module.exports = router