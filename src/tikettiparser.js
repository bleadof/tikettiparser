var _ = require('lodash'),
    config = require('./config.json');

function walk(object, key, breakFn, valueFn) {
    if(!object || !object[key]) {
        return undefined;
    }
    else if (breakFn(object[key])) {
        return valueFn(object[key]);
    }
    else {
        return _.map(_.keys(object[key]), function(key) {
            return walk(object[key], key, breakFn, valueFn);
        });
    }
}

function musicTag(tags) {
    var keys = _.keys(tags),
        found = _.map(keys, function(key) {
            return walk(tags,
                        key,
                        function(x) {
                            return x.name === config.MUSIC_TAG_IDENTIFIER;
                        },
                        function(x) {
                            return x;
                        });
        }),
        foundTag = _(found)
            .flatten()
            .filter(function(value) {
                return value !== undefined;
            })
            .first();
    return foundTag;
}

function eventWithBandsParsed(event, data) {
    if(event && event.name && _.contains(event.tags, musicTag(data.tags).id)) {
        console.log('isMusic', event);
    }
    else {
        return event;
    }
}

var ADDITIONAL_FIELDS = {
    'bands': eventWithBandsParsed
};

function addAdditionalFields(eventObject, additionalFields, data) {
    return _.reduce(additionalFields, function(result, field) {
        return _.isFunction(ADDITIONAL_FIELDS[field]) ?
            ADDITIONAL_FIELDS[field](result, data) : result;
    }, eventObject);
}

function createEventObjects(params) {
    var data = params.data ? params.data : params,
        additionalFields = params.data ? params.additionalFields : [],
        eventObjects = _.map(data.events, function(event) {
            return addAdditionalFields(_.zipObject(data.keys, event), additionalFields, data);
    });
    return eventObjects;
}

module.exports = {
    createEventObjects: createEventObjects
};
