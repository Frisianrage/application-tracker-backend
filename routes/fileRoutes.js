const express = require('express')
const {createNewResume, getFile, deleteFile} = require('./controller/userController')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(createNewResume).get(protect, getAllEmployer)
router.route('/:id').get(protect, getFile).delete(protect, deleteFile)

module.exports = router