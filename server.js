const config = {
    host: 'localhost',
    port: 5432,
    database: 'social_feed',
    user: 'postgres',
    
};

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');

const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL || config);
const passport = require('passport');

const Sequelize = require('sequelize')

//Models
const UsersModel = require('./models/users')
const PostsModel = require('./models/posts')
const CommentsModel = require('./models/comments')

const connectionString = `postgres://${config.username}: ${config.password}@${config.host}:${config.port}/${config.database}`

const sequelize = new Sequelize(process.env.DATABASE_URL || connectionString, {
    dialect: 'postgres',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

/* const sequelize = new Sequelize('social_feed', 'postgres', '', {
    host: process.env.DATABASE_URL || 'localhost',
    dialect: 'postgres',
    pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
    }
}); */
//Models
const Users = UsersModel(sequelize, Sequelize)
const Posts = PostsModel(sequelize, Sequelize)
const Comments = CommentsModel(sequelize, Sequelize)

//Joins
Users.hasMany(Posts, {foreignKey: 'user_id'})
Posts.belongsTo(Users, {foreignKey: 'user_id'})

var app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/login', function(req, res){
    
})

app.get('/api/posts', function (req, res) {
    Posts.findAll({include: [Users]}).then((results) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(results));
    });
});


//READ ABOUT THIS ONE BELOW
app.options('*', cors())

app.all('/*', function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
//READ ABOVE THIS LINE
idCounter = 1;
var posts = [
    {
        id: 1, 
        post: "My first post",
        imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Vombatus_ursinus_-Maria_Island_National_Park.jpg/640px-Vombatus_ursinus_-Maria_Island_National_Park.jpg",
        user: "Me"
    },
    {
        id: 2,
        post:"My second post",
        imageURL: "https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwjUyPT69J_mAhUKP60KHc0VDoQQjRx6BAgBEAQ&url=https%3A%2F%2Fwww.pexels.com%2Fphoto%2Fwombat-at-waldheim-1173659%2F&psig=AOvVaw1lM-zYCuZU8tb6UWhLWzQl&ust=1575683534538222",
        user: "You"
    }];
//Get /api/post
app.get('/api/posts', function (req, res) {
    User.findAll() .then((results) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(results));
    });
});
    
    /*db.query('SELECT * FROM posts')
        .then((results) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(results));
        })
        .catch((e) => {
            console.error(e);
        });
});*/
//Get /api/post:id
app.get('/api/posts/:id', function(req, res){
    let id = req.params.id;
    db.one("SELECT * FROM posts WHERE id=$1", [id])
        .then((results) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(results));
        })
        .catch((e) => {
            console.error(e);
        });
    });
//Get all comments from database
    app.get('/api/comments/:comments', function (req, res) {
        let comment = req.params.comment;
        db.one("SELECT * FROM posts WHERE id=$1", [id])
            .then((results) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(results));
            })
            .catch((e) => {
                console.error(e);
            });
    });
//Get all comments from a single user
    app.get('/api/comments/user_id/:id', function(req, res){
        let comment = req.params.comment;
        db.one('SELECT * FROM comments JOIN users on comments.user_id =user_id WHERE users.id=$1', [id])
            .then((results) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(results));
            })
            .catch((e) => {
                console.error(e);
            });
    })
//Get all comments that belong to a post
app.get('/api/comments/post/:id', function (req, res) {
    let id = req.params.id;
    db.query('SELECT * FROM comments JOIN users on comments.user_id = users.id WHERE comments.post_id=$1', [id])
        .then((results) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(results));
        })
        .catch((e) => {
            console.error(e);
        });
});

//Get all users
app.get('/api/users', function (req, res) {
    db.query('SELECT * FROM users')
        .then((results) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(results));
        })
        .catch((e) => {
            console.error(e);
        });
});

//Get a single user


//Post /api/post
//curl --data ""
/*app.post('/api/posts', function(req, res){
    if(req.body.post_title && req.body.post_body && req.body.imageURL && req.body.user) {
        idCounter++;
        let data = {
            id: idCounter,
            date: req.body.date,
            post_title: req.body.post_title,
            post_body: req.body.post_body,
            imageURL: req.body.imageURL,
            user: req.body.user,
           
        };
        posts.push(data);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    } else {
        res.status(434).send('Wombat is required')
    }
});*/

//Example curl : curl --data "name=john&amp;email=john@example.com&password=abc123" http://localhost:3000/api/register
app.post('/api/register', function (req, res) {
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    if (data.name && data.email && data.password) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(data.password, salt);
        data['password'] = hash;
        Users.create(data).then(function (user) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user));
        });;
    } else {
        res.status(434).send('Name, email and password is required to register')
    }
});
app.post('/api/login', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    if (email && password) {
        Users.findOne({
            where: {
                email: email
            },
        }).then((results) => {
            bcrypt.compare(password, results.password).then(function(matched) {
                if (matched) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(results));
                } else {
                    res.status(434).send('Email/Password combination did not match')
                }
            });
        }).catch((e) => {
            res.status(434).send('Email does not exist in the database')
        });
    } else {
        res.status(434).send('Both email and password is required to login')
    }
});





app.listen(3000, function(){
    console.log('Social Media API is now listening on port 3000...');
});