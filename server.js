require('dotenv').config();
const mongoose = require('mongoose');
var cors = require('cors')
mongoose.connect('mongodb+srv://laivtn18:ua4zaR4hs6Si1q2H@cluster0.c3i2zts.mongodb.net/diary?retryWrites=true&w=majority&appName=Cluster0')

const express = require('express');
const app = express();
app.use(express.json());
app.use(cors())

app.set('view engine', 'ejs')
app.set('views', './views')
const port = process.env.SERVER_PORT || 8000;


const userRoute = require('./routes/userRoute')
app.use('/api', userRoute)


const authRoute = require('./routes/authRoute')
app.use('/', authRoute)


const journalRoute = require('./routes/journalRoute')
app.use('/api', journalRoute)


const templateRoute = require('./routes/templateRoute')
app.use('/api', templateRoute)


const formRoute = require('./routes/formRoute')
app.use('/api', formRoute)


app.listen(port, function() {
    console.log('Server is running on port ' + port);
})

