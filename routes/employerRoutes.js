const express = require('express')
const {mostAppliedTo, lastChangedEmployer, createNewEmployer, getAllMyEmployer, getEmployerById, updateEmployerProfile, deleteEmployer, searchEmployer, getAllEmployer} = require('./controller/employerController')
const {protect, admin} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(protect, createNewEmployer).get(protect, getAllMyEmployer)
router.route('/mostapplied').get(protect, mostAppliedTo) 
router.route('/lastchanged').get(protect, lastChangedEmployer) 
router.route('/profile/:id').get(protect, getEmployerById).put(protect, updateEmployerProfile).delete(protect, deleteEmployer)
router.route('/admin/employerlist').get(protect, admin, getAllEmployer)
router.get('/search/:keyword', protect, searchEmployer)
module.exports = router