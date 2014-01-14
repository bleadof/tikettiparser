var tikettiObject = require('./data/tiketti.json'),
    expect = require('chai').expect,
    _ = require('lodash'),
    tikettiParser = require('../index.js');

describe('Tiketti object events', function() {
    describe('will be parsed to objects', function() {
        it('so that event id can be found', function() {
            var eventObjects = tikettiParser.createEventObjects(tikettiObject);
            expect(_.first(eventObjects)).to.contain.key('eventID');
        });
        it('so that the bands are parsed from the event name', function() {
            var params =
                    {
                        data: tikettiObject,
                        additionalFields: ['bands']
                    },
                eventObjects = tikettiParser.createEventObjects(params);
            expect(_.first(eventObjects)).to.contain.key('bands');
        });
    });
});
