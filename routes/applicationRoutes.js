const express = require('express')
const {getRecentApplications, getLastChangedApplication, createNewApplication, getAllMyApplications, deleteApplication, updateApplication, statusUpdate, addNewCoverletter, getApplicationById, getAllApplications} = require('./controller/applicationController')
const {admin, protect} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(protect, createNewApplication)
router.route('/mostrecent').get(protect, getRecentApplications)
router.route('/lastchanged').get(protect, getLastChangedApplication)
router.route('/summary').get(protect, getAllMyApplications)
router.route('/admin/applicationslist').get(protect, admin, getAllApplications)
router.route('/:id').delete(protect, deleteApplication).put(protect, updateApplication).get(protect, getApplicationById)
router.put('/:id/status', protect, statusUpdate)
router.put('/:id/coverletter', protect, addNewCoverletter)


module.exports = router