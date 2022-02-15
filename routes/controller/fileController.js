const File = require('../../models/fileModel.js')
const User = require('../../models/userModel')
const asyncHandler = require('express-async-handler')

// @desc    Create new resume
// @route   POST /api/files/:userId
// @access  Private

const createNewResume = asyncHandler( async (req, res) => {
    const {title, content} = req.body

    const file = await File.create({
        user: req.params.userId,
        content,
        title
    })

    if(file) {
        await User.findOneAndUpdate({_id: req.params.userId}, {resume: file._id})
        res.status(200).json({
            id: file._id,
            title: file.title,
            content: file.content,
            user: file.user
        })
    } else {
        res.status(400)
        throw new Error('Invalid file data!')
    }
})

// @desc    Get single file 
// @route   GET /api/files/:id
// @access  Private

const getFile = asyncHandler(async (req, res) => {
    
    try {
        const file = File.findById(req.params.id)

        if(file) {
            res.json({
                id: file._id,
                title: file.title,
                content: file.content,
                user: file.user
            })
        } else {
            res.status(404)
            throw new Error('File not found!')
        }
    } catch (error) {
        res.status(400)
        throw new Error('Invalid request!')
    }
})

// @desc    Delete file 
// @route   PUT /api/files/:id
// @access  Private /Admin

const deleteFile = asyncHandler(async (req, res) => {
    const file = await File.findById(req.body._id)

    if(file) {
        await file.remove()
        res.json({message: 'File successfully removed'})
    } else {
        res.status(404)
        throw new Error('File not found!')
    }
})

module.exports = {createNewResume, getFile, deleteFile}