const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.use('/api/users', userRoutes)

app.listen(PORT, console.log(`Server is running in port ${PORT}`))