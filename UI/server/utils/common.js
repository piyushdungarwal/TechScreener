var crypto      = require('crypto'),
    nodemailer  = require('nodemailer'),
    hbs         = require('nodemailer-express-handlebars'),
    jwt         = require('jsonwebtoken'),
    path        = require('path'),
    bcrypt      = require('bcrypt'),
    rootPath    = path.normalize(__dirname + '/../');

var config      = require('./config')
const saltRounds = 10;


function getResetToken(user) {
      // create the random token
    var token;
    return new Promise((resolve, reject) => {
        crypto.randomBytes(20, function(err, buffer) {
            if(err) {
                reject(err)
            } else {
                token = buffer.toString('hex');
                resolve({user: user, token: token})        
            }
        });
    })
}

/** 
    send email with a link to reset password with new password
*/
function passwordResetRequestMailSend(token, user) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'botharapayal234@gmail.com',
            pass: 'plsb8592'
        }
    });

    var handlebarsOptions = {
  	    viewEngine: 'handlebars',
  	    viewPath: path.resolve(rootPath, 'output/templates/'),
  	    extName: '.html'
  	};

  	transporter.use('compile', hbs(handlebarsOptions));

    // var token = 'abc' // just for testing
  
    const mailOptions = {
        from: 'botharapayal234@gmail.com', // sender address
        to: 'botharapayal@gmail.com', // list of receivers
        subject: 'Password help has arrived!',// Subject line
        template: 'forgot-password-email',// plain text body
        context: {
            url: 'http://localhost:2020/auth/reset_password?token=' + token,
            // name: user.fullName.split(' ')[0]
            name: user.firstName
        }
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            console.log('Errror:', err)
        else
            console.log('Success:', info);
    });
}

/** 
    send email for reset password has been successful
*/
function confirmResetPasswordMail(user) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'botharapayal234@gmail.com',
            pass: 'plsb8592'
        }
    });

    var handlebarsOptions = {
        viewEngine: 'handlebars',
        viewPath: path.resolve(rootPath, 'output/templates/'),
        extName: '.html'
    };

    transporter.use('compile', hbs(handlebarsOptions));
  
    const mailOptions = {
        from: 'botharapayal234@gmail.com', // sender address
        to: 'botharapayal@gmail.com', // list of receivers
        subject: 'Password Reset Confirmation',// Subject line
        template: 'reset-password-email',// plain text body
        context: {
            // name: user.fullName.split(' ')[0]
            name: 'PB'
        }
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            console.log('Errror:', err)
        else
            console.log('Success:', info);
    }); 
}


function preAuth(req, res) {

    const token = req.headers['authorization'];
    if(!token) {
        res.json({success: false, message: 'No Token'})
    } else {
        jwt.verify(token, config.secret, (err, decoded) => {
            if(err) {
                res.json({success: false, message: 'No Token valid'})
            } else {
                req.decoded = decoded;
            }
        })
    }
}

/** 
    @params myPlaintextPassword -  user entered plain password
*/
function getUserHash(myPlaintextPassword) {
    let userHash = null;

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
            // Store hash in your password DB.
            userHash = hash;
            console.log('userHeash', userHash);
        });
    });
    
    return userHash;
}

/** 
    @params myPlaintextPassword -  user entered plain password
            userHash - hash of password previously stored in db
*/

function comparePasswords(myPlaintextPassword, userHash) {

    bcrypt.compare(myPlaintextPassword, userHash, function(err, res) {
        if(res) {
            console.log("password match")
            return true;
        } else {
            console.log("passwords do not match")
            return false;
        }
    });
}


module.exports = {
    getResetToken: getResetToken,
    passwordResetRequestMailSend: passwordResetRequestMailSend,
    confirmResetPasswordMail: confirmResetPasswordMail,
    getUserHash: getUserHash,
    comparePasswords: comparePasswords,
    preAuth: preAuth
};
