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

    //fetch city names that exist in the db, result for autocomplete use
    app.get("/cities", function(req, res, next) {
      mydb.fetchCities(function(err, result) {
        if(err) {
          res.status(err.headers.status).end();
        } else {
          res.status(200).send(result);
        }
      })
    });

    //fetch destination information by id
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

    //fetch attachment images
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

    //fetch destination related topics by id
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

    //fetch a list of topics by search input, a temporary view is created each time
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

    //fetch a topic's detail by topic id
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


    //user register, check if has existed in the db
    app.post("/register", isExist, function (req, res, next) {
        let newUser = model.User.fromJSON(req.body);
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

    //user login request
    app.post("/login", authenticate);

    //send back login status to front end
    app.get("/checkLoginStatus", isLogin, function(req,res,next) {
      res.status(200).send({Login: true});
    })

    //fetch user details by id
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

    //post topic request, check if log in first
    app.post("/topic", isLogin, function (req, res, next) {
        let newTopic = req.body;
        console.log(1, newTopic)
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

    //update post request
    app.put("/post/:objid", isLogin, function(req, res, next) {
        let postId = req.params.objid;
        let content = req.body.repliesArray;
        mydb.updateData(postId, content, function(err, result) {
            if (err) {
                res.status(500).send({status: 500, message: 'internal error', type: 'internal'});
            } else {
                res.status(200).end("update successfully");
            }
        })
    });

    //update user profile request
    app.put("/user/:objid", isLogin, function(req, res, next) {
      let userId = "user_"+req.params.objid;
      mydb.updateUser(userId, req.body, function(err, result) {
        if (err) {
            res.status(500).send({status: 500, message: 'internal error', type: 'internal'});
        } else {
            res.status(200).end("update successfully");
        }
      })
    });

    //delete post request
    app.delete("/post/:objid", isLogin, function(req, res, next){
        let postId = req.params.objid;
        mydb.deleteData(postId, function(err, result) {
            if(err) {
                res.status(500).send("delete not success");
            } else {
                res.status(200).send(req.session.user_id);
            }
        })
    })

    //logout request
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
