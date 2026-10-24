require('dotenv').config({ path: '.env' })
const cors = require('cors')
const express = require('express')
const path = require('path')
const fileUp = require('express-fileupload')
const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(fileUp())
app.use('/uploads', express.static(path.join(__dirname, './uploads')))

const auth = require('./routes/auth')
app.use('/api/auth', auth)

const profile = require('./routes/profile')
app.use('/api/profile',profile)

//eva

const selfeva = require('./routes/Eva/selfeva')
app.use('/api/Eva/selfeva',selfeva)

const score_member = require('./routes/Eva/score_member')
app.use('/api/Eva/score_member',score_member)



app.use((req, res) => res.status(404).json({ message: 'Route Not Found' }))
app.listen(3001, '0.0.0.0', () => {
    console.log('Server Running on Port 3001')
})
