// Get the packages we need
var express = require('express'),
 //   router = express.Router(),
    mongoose = require('mongoose'),
    secrets = require('./config/secrets'),
    bodyParser = require('body-parser');
let apiRoutes = require("./api-routes")
// Create our Express application
var app = express();
var stylus = require('stylus')
var nib = require('nib')
var ejsLayouts = require('express-ejs-layouts')

app.set('view engine', 'ejs')


function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}


// tell node to compile.styl-files to normal css-files
app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
}))

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

// Connect to a MongoDB
mongoose.connect(secrets.mongo_connection,  { useNewUrlParser: true });

// Allow CORS so that backend and frontend could be put on different servers
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Use routes as a module (see index.js)
// require('./routes')(app, router);
app.use('/', apiRoutes)



app.use(express.static(__dirname + '/public'))
// Start the server
app.listen(port);
console.log('Server running on port ' + port);

var Tasks=mongoose.model('Task',{
    name: String,
    description: String,
    dealine:String,
    complete:String
})

app.post('/tasks',(req,res) =>{
    var task= new Tasks(req.body)

    message.save((err) => {
    if (err)
        sendStatus(500)

    message.push(req.body)
    res.sendStatus(200)

  })  
})