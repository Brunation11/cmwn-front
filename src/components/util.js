import _ from 'lodash';

var Util = {
    /**
     *  Takes in a nested json object and extracts properties from its data
     *  Expects nested data to have the following properties:
     *  'data' properties will exist at any level at whih an entity can exists
     *  e.g. groups.data.users.data
     *  'data' will arbitrarily be an array or object
     *  @param {object} target - the target json data
     *  @param {string} key - the property to extract
     *  @param {*} [notFoundValue=null] - value to be returned if key does not exist
     *  @returns {*} - generally returns an array of one or more entities, or if the
     *  property does not exist, returns notFoundValue
     */
    normalize: function (target, key, notFoundValue) {
        var retVal = _.get(target, 'data', notFoundValue);
        retVal = _.get(retVal, key, retVal);
        retVal = _.get(target, 'data', retVal);
        retVal = _.isArray(retVal) ? retVal : [retVal];
        return notFoundValue;
    }
};

export default Util;

