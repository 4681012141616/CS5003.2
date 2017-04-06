"use strict"
//data access object provides an interface for storage, use the interface to store and retrieve
//insert into DB, fetch data, delete data

var cradle = require('cradle');


class DAO {
    constructor() {
        this.db = new (cradle.Connection)

        ('http://klovia.cs.st-andrews.ac.uk:20631',

            {
                auth: {
                    username: "yz62",
                    password: "Whfk9kWK"
                }
            })
            .database("trippinpanda");
    }

    fetchDetails(id, callback) {
        if (typeof callback == 'function') {
            this.db.get(id, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    fetchImage(id, filename, callback) {
        if (typeof callback == 'function') {
            this.db.getAttachment(id, filename, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }


    //get a view of a list of topics based on the destination
    fetchDestinationTopics(id, callback) {
        if (typeof callback == 'function') {
            this.db.view("topics/byDestination", {key: id}, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    authenticateUser(id, callback) {
        if (typeof callback == 'function') {
            this.db.view("user/authenticateOnly", {key: id}, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    fetchUserDetails(id, callback) {
        if (typeof callback == 'function') {
            this.db.view("user/profile", {key: id}, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    getTemporaryView(id, callback) {
        if (typeof callback == 'function') {
            this.db.temporaryView({
                "map": "function (doc) {if (doc.type == 'topic' && doc.topic.match(/" + id + "/gi)) emit(doc.topic, doc);}"
            }, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    insertData(data, callback) {
        if (typeof callback == 'function') {
            this.db.save(data, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    fetchCities(callback) {
      if (typeof callback == 'function') {
          this.db.view("destination/byName", callback);
      }
      else
          throw new TypeError('Callback not a function');
    }

    deleteData(id, callback) {
        if (typeof callback == 'function') {
            this.db.remove(id, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    updateData(id, content, callback) {
        if (typeof callback == 'function') {
            this.db.merge(id, {name: content}, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }


}


module.exports = {
    DAO: DAO
};
