//the RESTful interface
//need to access the model and dao
"use strict"

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var dao = require('./dao');
var model = require('./model');
var CryptoJS = require('crypto-js');
var SHA256 = require('crypto-js/sha256');


var mydb = new dao.DAO();


var thePort;
module.exports = {
    runApp: runApp,
    configureApp: configureApp,
};

function runApp() {

    thePort = 50631;
    var app = express();
    configureApp(app);
    console.log("Listening on port " + thePort);
    app.listen(thePort);
}


function configureApp(app) {

    app.use(bodyParser.json());
    app.use(session({
        secret: "yz62"
    }));


    app.get("/cities", function(req, res, next) {
      mydb.fetchCities(function(err, result) {
        if(err) {
          res.status(err.headers.status).end();
        } else {
          res.status(200).send(result);
        }
      })
    });


    app.get("/destination/:objid", function (req, res, next) {
        let id = req.params.objid;
        mydb.fetchDetails(id, function (err, result) {
            if (err) {
                res.status(err.headers.status).end();
            } else {
                res.status(200).send(result);
            }
        });
    });

    app.get("/destination/img/:objid", function (req, res, next) {
        let id = req.params.objid.replace(".jpg", "");
        let filename = req.params.objid;

        res.setHeader("Content-Type", "image/jpeg");

        mydb.fetchImage(id, filename, function (err, result) {
            if (err) {
                console.dir(err)
                return
            } else {
                //console.dir(result);
                res.status(200).send(result.body);
            }
        })
    });

    app.get("/destination/topics/:objid", function (req, res, next) {
        let id = req.params.objid;
        mydb.fetchDestinationTopics(id, function (err, result) {
            if (err) {
                res.status(err.headers.status).end();
            } else {
                res.status(200).send(result);
            }
        })
    });

    //search a topic
    app.get("/topics/:objid", function (req, res, next) {
        let id = req.params.objid;
        mydb.getTemporaryView(id, function (err, result) {
            if (err) {
                res.status(err.headers.status).end();
            } else {
                res.status(200).send(result);
            }
        })

    });

    app.get("/topic/:objid", function (req, res, next) {
        let id = req.params.objid;
        mydb.fetchDetails(id, function (err, result) {
            if (err) {
                res.status(err.headers.status).end();
            } else {
                res.status(200).send(result);
            }
        });
    });


    app.post("/register", isExist, function (req, res, next) {
        var newUser = model.User.fromJSON(req.body);
        //console.log(newUser);
        if (newUser) {
            mydb.insertData(newUser, function (err, result) {
                if (err) {
                    res.status(500).send({status: 500, message: 'internal error', type: 'internal'});
                } else {
                    res.send({success: true});
                }
            })
        }
    })


    app.post("/login", authenticate);

    app.get("/user/:objid", isLogin, function (req, res, next) {
        let id = req.params.objid;
        mydb.fetchUserDetails(id, function (err, result) {
            if (err) {
                res.status(err.headers.status).end();
            } else {
                res.status(200).send(result[0]);
            }
        });
    });

    app.post("/topic", isLogin, function (req, res, next) {
        //console.log('topic login');
        var newTopic = model.Topic.fromJSON(req.body);
        if (newTopic) {
            mydb.insertData(newTopic, function (err, result) {
                if (err) {
                    res.status(500).send({status: 500, message: 'internal error', type: 'internal'});
                } else {
                    res.send({success: true});
                }
            });
        }
    });


    app.put("/obj/:objid", function (req, res, next) {

        res.status(200).end("put obj");
    });

    app.get('/logout', function (req, res) {
        console.log("Log out:" + req.session.user_id);
        res.redirect('back');
        delete req.session.user_id;
    })

    app.use('/', express.static('static'));

}


function authenticate(req, res, next) {
    mydb.authenticateUser(req.body.username, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).send({status: 500, message: 'internal error', type: 'internal'});
        } else {
            if (SHA256(req.body.password).toString(CryptoJS.enc.Base64) != result[0].value.passwordHash) {
                console.log("Fail to log in");
                res.sendStatus(401);
            } else {
                req.session.user_id = "user_" + result[0].key;
                req.session.cookie.expires = new Date(Date.now() + 600000);
                res.status(200).json(result[0].key);
            }
        }
    })
}

function isLogin(req, res, next) {
    if (!req.session.user_id) {
        res.status(401).end("You haven't logged in yet.");
    }
    else {
        console.log("Log in: " + req.session.user_id);
        next();
    }
}

function isExist(req, res, next) {
    mydb.fetchUserDetails(req.body.username, function (err, result) {
        if (err) {
            res.sendStatus(500);
        } else {
            if (result.length == 0) {
                next();
            } else {
                res.status(400).send("Bad request, user already exists");
            }

        }

    })
}
