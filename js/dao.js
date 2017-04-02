//data access object provides an interface for storage, use the interface to store and retrieve
//insert into DB, fetch data, delete data
//remember to export module


var cradle = require('cradle');

//connection url : http://yz62.host.cs.st-andrews.ac.uk:20631


class DAO {
    constructor() {
        this.db = new (cradle.Connection)
        ('localhost:20631',
            {
                auth: {
                    username: "yz62",
                    password: "j473M9sz"
                }
            })
            .database("trippinpanda");
    }

    fetchDestination(id, callback) {
        if (typeof callback == 'function') {
            this.db.get(id, callback);
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

    getTemporaryView(id, callback) {
        if (typeof callback == 'function') {
            this.db.temporaryView({
                "map": "function (doc) {if (doc.type == 'topic' && doc.topic.match(/"+id+"/gi)) emit(doc.topic, doc);}"
            }, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }

    insertTopic(data, callback) {
        if (typeof callback == 'function') {
            this.db.save(data, callback);
        }
        else
            throw new TypeError('Callback not a function');
    }


}


module.exports = {
    DAO: DAO
};
