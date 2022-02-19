const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const employerRoutes = require('./routes/employerRoutes')
const applicationRoutes = require('./routes/applicationRoutes')

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.use('/api/users', userRoutes)
app.use('/api/employers', employerRoutes)
app.use('/api/applications', applicationRoutes)

app.listen(PORT, console.log(`Server is running in port ${PORT}`))