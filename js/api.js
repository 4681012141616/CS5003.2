//the RESTful interface
//need to access the model and dao


//var subdir = '/CS5003/TrippinPanda';

var express = require('express');
var bodyParser = require('body-parser');
var dao = require('./dao');
var model = require('./model');


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
        let id = req.params.objid.replace(".jpg","");
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


    app.get("/region-cities/:objid", function (req, res, next) {
        let id = req.params.objid;
        mydb.fetchDetails(id, function (err, result) {
            if (err) {
                res.status(err.headers.status).end();
            } else {
                res.status(200).send(result);
            }
        });
    });

    app.get("/destination-topics/:objid", function (req, res, next) {
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
    app.get("/search-topics/:objid", function (req, res, next) {
        let id = req.params.objid;
        mydb.getTemporaryView(id, function(err, result) {
            if(err) {
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

    app.post("/add-new-topic", function (req, res, next) {
        var newTopic = model.Topic.fromJSON(req.body);
        if (newTopic) {
            mydb.insertTopic(newTopic, function (err, result) {
                if (err) {
                    res.status(500).send({status:500, message: 'internal error', type:'internal'});
                } else {
                    res.send({success: true});
                }
            });
        }
    });

    app.put("/obj/:objid", function (req, res, next) {

        res.status(200).end("put obj");
    });
    app.use('/', express.static('static'));

}
