var express     = require('express'),
    path        = require('path'),
    rootPath    = path.normalize(__dirname + '/../'),
    bodyParser  = require('body-parser'),
    bcrypt      = require('bcrypt'),
    crypto      = require('crypto'),
    jwt         = require('jsonwebtoken'),
    nodemailer  = require('nodemailer'),
    hbs         = require('nodemailer-express-handlebars'),
    mongoose    = require('mongoose');

var router1 = require('./routes/routes');

mongoose.connect('mongodb://localhost:27017/myStockDB')

const config      = require('./utils/config');
const common      = require('./utils/common');
const UserModel   = require('../source/model/UserItem');

var spawn = require("child_process").spawn;
var process = spawn('python3', ["../python/stockScreener.py"]);
// var process2 = spawn('python3', ["../python/stockClassify.py"]);

const saltRounds = 10;
var filterArray = [1, 2, 3, 4, 5, 6, 7, 8, 9],
    dataString = '',
    dataString2 = '';

mongoose.connection.on('connected', () => {
  console.log("Mongo Db connected at port 27017");
})

mongoose.connection.on('error', (err) => {
  console.log(err);
})

process.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
    //Here is where the error output goes
});

// process.stdin.write(JSON.stringify(filterArray));
// process.stdin.write();
process.stdin.end();

var app = express();
var port = 2020;
process.stdout.on('data', function(data) {
    console.log("Getting data");
    dataString += data.toString();
});

process.stdout.on('end', function() {
    console.log('String output=', dataString);
});

// function getResetToken(user) {
//       // create the random token
//     var token;
//     return new Promise((resolve, reject) => {
//         crypto.randomBytes(20, function(err, buffer) {
//             if(err) {
//                 reject(err)
//             } else {
//                 token = buffer.toString('hex');
//                 resolve({user: user, token: token})        
//             }
//         });
//     })
// }

// function gmailSend(token, user) {
//     var transporter = nodemailer.createTransport({
//          service: 'gmail',
//          auth: {
//                 user: 'botharapayal234@gmail.com',
//                 pass: 'plsb8592'
//             }
//         });

//     var handlebarsOptions = {
//       viewEngine: 'handlebars',
//       viewPath: path.resolve(__dirname, 'source/templates/'),
//       extName: '.html'
//     };

//     transporter.use('compile', hbs(handlebarsOptions));

//     var emailPath = path.join(rootPath + '/source/templates/forgot-password-email.html')


//     // var token = 'abc' // just for testing
//     const mailOptions = {
//       from: 'botharapayal234@gmail.com', // sender address
//       to: 'botharapayal@gmail.com', // list of receivers
//       subject: 'Password help has arrived!',// Subject line
//       template: 'forgot-password-email',// plain text body
//       context: {
//           url: 'http://localhost:2020/auth/reset_password?token=' + token,
//           // name: user.fullName.split(' ')[0]
//           name: user.firstName
//         }
//     };

//     transporter.sendMail(mailOptions, function (err, info) {
//        if(err)
//          console.log('Errror:', err)
//        else
//          console.log('Success:', info);
//     });
// }

function preAuth(req, res) {

    const token = req.headers['authorization'];
    if(!token) {
        res.json({success: false, message: 'No Token'})
    } else {
        jwt.verify(token, "1111", (err, decoded) => {
            if(err) {
                res.json({success: false, message: 'No Token valid'})
            } else {
                req.decoded = decoded;
            }
        })
    }
}

// process2.stdin.end();
// process2.stdout.on('data', function(data) {
//     console.log("Getting data");
//     dataString += data.toString();
// });
//
// process2.stdout.on('end', function() {
//     console.log('String output=', dataString);
// });
//
// process2.stderr.on('data', function(data) {
//     console.log('stderr: ' + data);
//     //Here is where the error output goes
// });

// using bcrypt to generate salt and hash 
// check with DB once
// myPlaintextPassword -> entered password
// saltrounds -> as defined above

// bcrypt.genSalt(saltRounds, function(err, salt) {
//     bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
//         // Store hash in your password DB.
//         userHash = hash;
//         console.log('userHeash', userHash);
//     });
// });

// call this method on user login to verify username/password
// myPlaintextPassword -> entered password
// userHash -> get current user hash from DB

// bcrypt.compare(myPlaintextPassword, userHash, function(err, res) {
//     if(res) {
//         console.log("password match")
//     } else {
//         console.log("passwords do not match")
//     }

// });


app.use(express.static(rootPath));
app.use(express.static(rootPath + '/output'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(function(req, res, next) {
//     const token = req.headers['Authorization'];
//     if(!token) {
//         res.json({success: false, message: 'No Token'})
//     } else {
//         jwt.verify(token, "1111", (err, decoded) => {
//             if(err) {
//                 res.json({success: false, message: 'No Token valid'})
//             } else {
//                 req.decoded = decoded;
//                 next();
//             }
//         })
//     }
// })


app.get("/companies/all", function(req, res) {
    console.log("My api");
    res.send({
        "mydata": JSON.parse(dataString)
    });

});

app.get("/companyinfo/", function(req, res) {
    // console.log("My api", req);
    res.send({
        "mydata": {}
    });

});


app.get("/output/", function(req, res) {
    res.sendFile(path.join(rootPath + '/output/index.html'));
});

app.get("/watchlist/all", function(req, res) {
    res.send("Watches");
});

// User fetch/POST data for login workflow

// app.post("/users/postdata", (req, res) => {
//     var foo = req.body.foo;
//     var kaa = req.body.kaa;
//     console.log(foo);
//     console.log(kaa);
//     res.send("process complete");
// });
 
// app.get("/users/getdata", (req, res) => {
//     var data = { // this is the data you're sending back during the GET request
//         data1: "mee",
//         data2: "po"
//     }
//     res.status(200).json(data)
// });

// Get all users
app.get("/api/users", function(req, res) {
    let users = [{
        username: q,
        password: 1111
    }]
    res.send(users);
});


// Get user by Id
// app.get("/api/users/:id", function(req, res) {
//     res.send("All User By Id");
// });

// Get user by username
app.get("/api/users/:username", function(req, res) {
    let user = {
        password: "1111"
    }
    let token = jwt.sign({
        userId: req.params.username
    },
    user.password,
    {expiresIn: '24h'})


    let result = {
        success: true,
        message: 'Success Login',
        token: token,
        password: user.password
    }
    res.send(result);
});


// login api
app.post('/api/authenticate', function(req, res) {

    // let user = {
    //     password: "1111"
    // }

    let myPlaintextPassword = req.body.password;
    let currentUsername = req.body.username;

    UserModel.findOne({
        userName: currentUsername
      }).exec(function(err, user) {
        if (user) {
            bcrypt.compare(myPlaintextPassword, user.password, function(err, result) {
                if(result) {
                    let token = jwt.sign({
                                    userName: currentUsername
                                },
                                config.secret,
                                {
                                    expiresIn: '24h'
                                })

                    let result = {
                        success: true,
                        message: 'Success Login',
                        token: token,
                        username: user.userName,
                        password: user.password
                    }
                    res.send(result);
                } else {
                    console.log("passwords do not match")
                }
            });
            
        } else {
          console.log("Errror: User not found");
        }
      });

    
    // let token = jwt.sign({
    //     userId: req.params.username
    // },
    // config.secret,
    // {expiresIn: '24h'})
    // let result = {
    //     success: true,
    //     message: 'Success Login',
    //     token: token,
    //     password: user.password
    // }
    // res.send(result);

})

app.post('/api/forgot_password/', function(req, res) {

   UserModel.findOne({
        userName: req.body.username
      }).exec(function(err, user) {
        if (user) {
            common.getResetToken(user).then(result => {
                let resetTokenObject = result;
                UserModel.findByIdAndUpdate({ _id: resetTokenObject.user._id },
                                            { reset_password_token: resetTokenObject.token, reset_password_expires: Date.now() + 86400000 },
                                            { upsert: true, new: true })
                        .exec(function(err, new_user) {
                            common.passwordResetRequestMailSend(resetTokenObject.token,user);
                  });
                res.send({success: true})

            }).catch(err => {

                res.send({success: false})
            });
    
        } else {
          console.log("Errror: User not found");
        }
      });

});

// return reset password form html page
app.get('/auth/reset_password', function (req, res) {
    res.sendFile(path.join(rootPath + '/output/templates/reset-password-form.html'));
});

// verify two passwords received
app.post('/auth/reset_password', function (req, res) {
    let newPassword = req.body.newPassword;
    let verifyPassword = req.body.verifyPassword;
    let token = req.body.token;

    UserModel.findOne({
        reset_password_token: token,
        reset_password_expires: {
          $gt: Date.now()
        }
      }).exec(function(err, user) {
        if (!err && user) {
            if (newPassword === verifyPassword) {
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(newPassword, salt, function(err, hash) {
                        // Store hash in your password DB.
                        user.password = hash;
                        user.reset_password_token = undefined;
                        user.reset_password_expires = undefined;
                        user.save(function(err) {
                            if (err) {
                                return res.status(422).send({
                                    message: err
                                });
                            } else {
                                // send success password reset email
                                common.confirmResetPasswordMail(user);
                            }
                        });
                    });
                });
            } else {
                console.log("both passwords do not match");
            }
        } else {
            console.log("Invalid token")   
        }
    });
      //       user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);
      //       user.reset_password_token = undefined;
      //       user.reset_password_expires = undefined;
      //       user.save(function(err) {
      //         if (err) {
      //           return res.status(422).send({
      //             message: err
      //           });
      //         } else {
      //           var data = {
      //             to: user.email,
      //             from: email,
      //             template: 'reset-password-email',
      //             subject: 'Password Reset Confirmation',
      //             context: {
      //               name: user.fullName.split(' ')[0]
      //             }
      //           };

      //           smtpTransport.sendMail(data, function(err) {
      //             if (!err) {
      //               return res.json({ message: 'Password reset' });
      //             } else {
      //               return done(err);
      //             }
      //           });
      //         }
      //       });
      //     } else {
      //       return res.status(422).send({
      //         message: 'Passwords do not match'
      //       });
      //     }
      //   } else {
      //     return res.status(400).send({
      //       message: 'Password reset token is invalid or has expired.'
      //     });
      //   }
      // });


    res.send({success: true, message: 'Success Reset Pwd'})
})

app.get('/profile', function(req,res){
    
    preAuth(req, res);
    res.send(req.decoded)
});

// Create new user
app.post("/api/users", function(req, res) {
        console.log("req", req.body);
        let newUserName = req.body.username;
        let newUserPassword = req.body.password;
        let userHash = null;

        // generate user hash
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(newUserPassword, salt, function(err, hash) {
                // Store hash in your password DB.
                userHash = hash;

                const newUserObj = new UserModel({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    userName: newUserName,
                    password: userHash,
                    createdAt: new Date()
                });

                newUserObj.save(err => {
                    if (err) return res.status(500).send(err);
                    return res.status(200).send(newUserObj);
                })
            });
        });

        // save user to db 
        // const newUserObj = new UserModel({
        //     firstName: req.body.firstName,
        //     lastName: req.body.lastName,
        //     userName: newUserName,
        //     password: userHash,
        //     createdAt: new Date()
        // });

        // newUserObj.save(err => {
        //     if (err) return res.status(500).send(err);
        //     console.log("new:", newUserObj);
        //     return res.status(200).send(newUserObj);
        // })

        let result = {
            status: 200,
            success: true,
            message: 'Register success'
        }
    // res.send(result);
});

// Update a user
// app.post("/api/users/:id", function(req, res) {
        // let userUpdated = req.user;
//     res.send("All User By username");
// });

// Delete a user
// app.delete("/api/users/:id", function(req, res) {
        // let userDeleted = req.user;
//     res.send("All User By username");
// });


app.get('*', function (req, res) {
    res.sendFile(path.join(rootPath + 'output/index.html'));
});

app.listen(port);
console.log("Listening on port: ", port);
