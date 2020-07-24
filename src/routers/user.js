const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')

router.post('/api/users', async (req,res) => {
    res.send(req.body)
    // const user = new User(req.body)
    // try {
    //     await user.save()
    //     sendWelcomeEmail(user.email, user.name)
    //     const token = await user.generateAuthToken()
    //     res.status(201).send({ user, token })
    // } catch (e) {
    //     res.status(500).send(e)
    // }
})

router.post('/api/users/login', async (req,res) => {
    email = req.body.email
    password = req.body.password
    try {
         const user = await User.findByCredentials(email, password)
         const token = await user.generateAuthToken()
         res.send({user, token})
         
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/api/users/logoutAll', auth, async(req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()

    } catch(e) {
        res.status(500).send(e)
    }
})

router.post('/api/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/api/users/me', auth, async (req,res) => {
    res.send(req.user)
})

router.get('/api/users/:id', async (req,res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        res.send(user)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.patch('/api/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','age','password']
    const isValidOperation = updates.every((update) =>  allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({error : 'Invalid updates!'})
    }
    try {
        updates.forEach((update) =>  req.user[update] = req.body[update])
        
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/api/users/me', auth, async (req,res) => {
    try{
        req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(e) {
        res.status(500).send(e)
    }
})

const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('File type should be jpg, png, or jpeg'))
        }

        callback(undefined, true)
    }
})

router.post('/api/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width:256, height: 256}).png().toBuffer()
    req.user['avatar'] = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/api/users/me/avatar', auth, async (req,res) => {
    try {
        req.user['avatar'] = undefined
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/api/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router