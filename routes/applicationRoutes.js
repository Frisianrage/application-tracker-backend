const express = require('express')
const {createNewApplication, getAllMyApplications, deleteApplication, updateApplication, statusUpdate, addNewCoverletter, getApplicationById, getAllApplications} = require('./controller/applicationController')
const {admin, protect} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(protect, createNewApplication)
router.route('/summary').get(protect, getAllMyApplications)
router.route('/:id').delete(protect, deleteApplication).put(protect, updateApplication).get(protect, getApplicationById)
router.route('/admin/applicationslist').get(protect, admin, getAllApplications)
router.put('/:id/status', protect, statusUpdate)
router.put('/:id/coverletter', protect, addNewCoverletter)

module.exports = router