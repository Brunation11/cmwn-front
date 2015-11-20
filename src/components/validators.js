/** validation rules. Follows bootstrap conventsions.*/
/**
 * length validation. Defaults to 3 just because. Exported as len because we don't want to overwrite the length property.
 * @param {string} str
 * @param {number} [min = 3] - length to check against
 */
import _ from 'lodash';

var required = function (str) {
    if (str != null && str !== '') {
        return 'success';
    }
    return 'error';
};

var length = function (str, min = 3) {
    if (str && str.length > min) {
        return 'success';
    }
    return 'error';
};

var date = function (str) {
    return _.isNaN(Date.parse(str)) ? 'error' : 'success';
};

var email = function (str) {
    /** from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(str) ? 'success' : 'error';
};

/**
 * Validate can be called itself to join several rules. Rules are specified as strings passed as additional arguments
 * @param {string} str
 */
var Validate = function (str) {
    var rules = Array.prototype.slice.call(arguments, 1);
    return _.reduce(rules, (acc, rule) => {
        if (acc === 'error' || Validate[rule](str) === 'error') {
            return 'error';
        }
        return 'success';
    }, 'success');
};

Validate.required = required;
Validate.len = length;
Validate.date = date;
Validate.email = email;
export default Validate;

