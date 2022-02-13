const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const employerRoutes = require('./routes/employerRoutes')
const fileRoutes = require('./routes/fileRoutes')

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.use('/api/users', userRoutes)
app.use('/api/employers', employerRoutes)
app.use('/api/files', fileRoutes)

app.listen(PORT, console.log(`Server is running in port ${PORT}`))