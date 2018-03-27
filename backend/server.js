var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var jwt = require('jwt-simple')
var app = express();

var User = require('./models/User.js')

var posts =[
    {message: 'hello'},
    {message: 'hi'}
]

var unecessaryInformation = [
    {info: 'information 1 - test'},
    {info: 'information 2 - test 2'},    
]

app.use(cors())
app.use(bodyParser.json())

app.get('/posts', (req, res) =>{
    res.send(posts)
})

app.get('/information', (req, res) =>{
    res.send(unecessaryInformation)
})

app.post('/register', (req, res) =>{
    var userData = req.body
    var user = new User(userData)

    console.log(userData.pwd + " | " + userData.email)
    user.save((err, result) => {
        if(err)
            console.log('saving user error')

        res.sendStatus(200)
    }) 
})

app.post('/login', async(req, res) =>{
    var userData = req.body;
    var user = await User.findOne({email: userData.email})
    if(!user)
        return res.status(401).send({message: 'Email or Password invalid'});

    if(userData.pwd != user.pwd)
        return res.status(401).send({message: 'Email or Passowrd invalid'});


    var payload = {}        
    var token = jwt.encode(payload, '123')
    
    res.status(200).send({token});
})

//set the mongodb url 
mongoose.connect("mongodb://tarcisio:1234@ds259778.mlab.com:59778/node-angular",  (err) =>{
    if(!err)
        console.log('connected to mongo')    
})


app.listen(3000)