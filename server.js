const express = require('express');
const bcrypt = require('bcrypt-nodejs'); 
const cors = require('cors');
const knex = require('knex');
const { db } = require('pg');

const app = express();
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

knex.connect();

app.use(cors());
app.use(express.json());

//ROOT END POINT
app.get('/', (req, res) => { res.send('IT IS WORKING!!') })

//SIGNING IN INTO THE ACCOUNT
app.post('/signin', signin.handleSignin(db, bcrypt))
//REGISTERING NEW USER
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

//INCREASING THE ENTRIES AGAINST EACH SEARCH
app.put('/image', (req, res) => { image.handleImage(req, res, db)})

//FINDING DETAILS ABOUT A PARTICULAR USER
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

//HANDLING THE API CALL FROM CLARIFAI
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3001, ()=> {
  console.log(`app is running on port ${process.env.PORT}`)
})