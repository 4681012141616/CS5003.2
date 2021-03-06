//store different classes
class Topic {
    constructor(topic, userId, content, destinationId, date, replies) {
        this._id = topic.replace(/\s/g, "_");
        this._topic = topic;
        this._userId = userId;
        this._content = content;
        this._destinationId = destinationId;
        this._date = date;
        this._type = "topic";
        this._replies = replies;
    }

    static fromJSON(json) {
        var topic = json.topic;
        var userId = json.userId;
        var content = json.content;
        var destinationId = json.destinationId;
        var date = json.date;
        var replies = json.replies;

        if (!userId || !topic || !content || !destinationId) {
            return null;
        }
        return new Topic(topic, userId, content, destinationId, date, replies);
    }

    toJSON() {
        return {
            _id: this._id,
            topic: this._topic,
            userId: this._userId,
            content: this._content,
            destinationId: this._destinationId,
            date: this._date,
            type: this._type,
            replies: this._replies
        };
    }
}

class User {
    constructor(username, password, email) {
        this._id = "user_" + username;
        this.username = username;
        this.password = password;
        this.email = email;
        this.type = "user";
    }

    static fromJSON(json) {
        var username = json.username;
        var password = json.password;
        var email = json.email;

        if(!username || !password) {
          return null;
        }
        return new User(username, password, email);
    }

    toJSON() {
        return {
            _id: this._id,
            username: this.username,
            password: this.password,
            type: this.type,
            email: this.email
        }
    }
}

var moduleExports = {
    Topic: Topic,
    User: User
};

if (typeof __dirname == 'undefined')
    window.hello = moduleExports;
else
    module.exports = moduleExports;
