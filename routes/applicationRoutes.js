const express = require('express')
const {createNewApplication, getAllMyApplications, deleteApplication} = require('./controller/applicationController')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(protect, createNewApplication)
router.route('/summary').get(protect, getAllMyApplications)
router.route('/:id').delete(protect, deleteApplication)

module.exports = router