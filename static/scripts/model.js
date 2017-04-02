//store different classes

class Topic {
    constructor(topic, userId, content, destinationId, date) {
        this._id = topic.replace(/\s/g,"_");
        this._topic = topic;
        this._userId = userId;
        this._content = content;
        this._destinationId = destinationId;
        this._date = date;
        this._type = "topic";
        this._replies = null;
    }

    static fromJSON(json) {
        var topic = json.topic;
        var userId = json.userId;
        var content = json.content;
        var destinationId = json.destinationId;
        var date = json.date;

//TODO: add validation here!!
        if(!userId) {
            return null;
        }

        return new Topic(topic, userId, content, destinationId, date);
    }

    toJSON() {
        return {
            _id:this._id,
            topic:this._topic,
            userId:this._userId,
            content: this._content,
            destinationId: this._destinationId,
            date: this._date,
            type: this._type,
            replies: this._replies
        };
    }
}

var moduleExports = { Topic: Topic };
if(typeof __dirname == 'undefined')
    window.hello = moduleExports;
else
    module.exports = moduleExports;
