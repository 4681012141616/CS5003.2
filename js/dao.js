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

    //fetch details of an object in the databse given the id of the document
    fetchDetails(id, callback) {
        if (typeof callback == 'function') {
            this.db.get(id, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    //Retrieve attachment images of a document given the id of the document
    fetchImage(id, filename, callback) {
        if (typeof callback == 'function') {
            this.db.getAttachment(id, filename, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }


    //Get a list of topics related to the destination, a view with the destination as the key and the topic details as value is stored in the database
    fetchDestinationTopics(id, callback) {
        if (typeof callback == 'function') {
            this.db.view("topics/byDestination", {key: id}, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    //For user authenticate use only, a view containing the user_id and passwordHash
    authenticateUser(id, callback) {
        if (typeof callback == 'function') {
            this.db.view("user/authenticateOnly", {key: id}, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    //Retrieve user details given a user id, excluding passwordHash
    fetchUserDetails(id, callback) {
        if (typeof callback == 'function') {
            this.db.view("user/profile", {key: id}, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    //Generate temporary view of topics whose names contain the user input to search a topic, not stored in the database
    //but the functionality depreciates as generating temporary views takes time
    getTemporaryView(id, callback) {
        if (typeof callback == 'function') {
            this.db.temporaryView({
                "map": "function (doc) {if (doc.type == 'topic' && doc.topic.match(/" + id + "/gi)) emit(doc.topic, doc);}"
            }, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    //Insert data to database
    insertData(data, callback) {
        if (typeof callback == 'function') {
            this.db.save(data, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    //Retrieve cities
    fetchCities(callback) {
      if (typeof callback == 'function') {
          this.db.view("destination/byName", callback);
      }
      else
          throw new TypeError('Callback not a function');
    }

    //delete data in the database given an id of the document
    deleteData(id, callback) {
        if (typeof callback == 'function') {
            this.db.remove(id, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    //Update replies of a topic
    updatePost(id, content, callback) {
        if (typeof callback == 'function') {
            this.db.merge(id, {replies: content}, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    //update user profile, only changes bio, favouritePlace, posts
    updateUser(id, content, callback) {
        if (typeof callback == 'function') {
            this.db.merge(id, {bio: content.bio, favouritePlaces: content.favouritePlaces, posts: content.posts}, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

}


module.exports = {
    DAO: DAO
};
