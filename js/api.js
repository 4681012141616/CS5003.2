//the RESTful interface
//need to access the model and dao



//var subdir = '/CS5003/TrippinPanda';

var express = require('express');
var bodyParser = require('body-parser');
var mydb = require('./dao.js').mydb;


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

      app.get("/destination/:objid", function(req, res, next) {
          let id = req.params.objid;
          mydb.get(id, function(err, couchresult) {
              res.status(200).end(JSON.stringify(couchresult));
          });
		});

      app.get("/region-cities/:objid", function(req, res, next) {
          let id = req.params.objid;
          mydb.get(id, function(err, couchresult) {
              res.status(200).end(JSON.stringify(couchresult));
          });
      });

    app.put("/obj/:objid", function(req,res,next) {

	      res.status(200).end("put obj");
	  });


    app.post("/post", function(req,res,next) {
      let id = req.body.title.replace(/\s/g, "-");


      mydb.save(id,req.body
      , function (err, doc) {
        console.log(err, doc);
        if(err) {
            res.send(500, err);
        } else {
          res.send({success:true});
        }
      });

	     // res.status(201).end(JSON.stringify(req.body));
       console.log(req.body);
});

    app.use('/', express.static('static'));

    app.get("/test", function(req, res){
	       res.send('Test');
       });
  }
