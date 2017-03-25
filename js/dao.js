//data access object provides an interface for storage, use the interface to store and retrieve
//insert into DB, fetch data, delete data
//remember to export module


var cradle = require('cradle');
//connection url : http://yz62.host.cs.st-andrews.ac.uk:20631
var mydb = new(cradle.Connection)
('localhost:20631',
	{auth:{username:"yz62",
password:"j473M9sz"}})
.database("trippinpanda");

module.exports={
  mydb: mydb,
};
