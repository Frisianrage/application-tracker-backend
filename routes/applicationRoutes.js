const express = require('express')
const {createNewApplication, getAllMyApplications, deleteApplication, updateApplication, statusUpdate, addNewCoverletter, getApplicationById} = require('./controller/applicationController')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(protect, createNewApplication)
router.route('/summary').get(protect, getAllMyApplications)
router.route('/:id').delete(protect, deleteApplication).put(protect, updateApplication).get(protect, getApplicationById)
router.post('/:id/status', protect, statusUpdate)
router.post('/:id/coverletter', protect, addNewCoverletter)

module.exports = router