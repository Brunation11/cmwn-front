import React from 'react';
import _ from 'lodash';
import Immutable from 'immutable';
import {Input} from 'react-bootstrap';

import Validator from 'components/validators';

class ValidatedInput extends Input {
    isValid() {
        return this.props.validate();
    }
    getValue() {
        return super.getValue();
    }
    constructor() {
        super();
    }
    render() {
        var input = super.render();
        input = React.cloneElement(input, {bsStyle: this.props.validate()});
        return input;
    }
//    render() {
//        var props = Immutable.Map(this.props);
//        props = props.set('bsStyle', this.props.validate());
//        return (
//            <Input {...props.toObject()}>{this.props.children}</Input>
//        );
//    }
}

/**
 * Were going to make some assumptions here about what a child of
 * our form will look like. It will either be a non-bootstrap-input
 * element, in which case we will clone it and leave it be. If we
 * encounter a bootstrap input with a validate prop, we clone it,
 * but add a bsStyle string based on the rules listes
 * in the validate prop, as well as an isValid method that returns
 * the outcome of applying them. These validation methods make one
 * further important assumption - that the return value of .getValue
 * will always be a string, which needs to be true for form submission
 * anyway.
 *
 * This module is a strong candidate for open sourcing as an alternative
 * to the somewhat more ambitious https://www.npmjs.com/package/react-bootstrap-validation
 */
var Form = React.createClass({ // eslint-disable-line vars-on-top
    isValid: function () {
        return _.reduce(
            this.refs,
            (acc, child) => acc && child.isValid() !== 'error',
            true
        );

    },
    render: function () {
        var self = this;
        return (
            <form {...self.props}>
                {React.Children.map(self.props.children, child => {
                    var validationFn;
                    var propsForChild;
                    var props;
                    var validators;

                    if (child == null) {
                        return child;
                    }
                    propsForChild = child.props;
                    props = child.props || {};

                    if (props.validate != null) {
                        propsForChild = Immutable.Map(props);
                        validators = [].concat(props.validate);

                        validationFn = _.reduce(validators, (a, v) => {
                            if (_.isFunction(v)) {
                                return a(() => {
                                    if (self && self.refs && child.ref && self.refs[child.ref] && _.isFunction(self.refs[child.ref].getValue)) {
                                        return v(self.refs[child.ref].getValue());
                                    }
                                    return 'success';
                                });
                            } else {
                                return a(() => {
                                    if (self && self.refs && child.ref && self.refs[child.ref] && _.isFunction(self.refs[child.ref].getValue)) {
                                        return Validator.call(child, self.refs[child.ref].getValue(), ...v.split(','));
                                    }
                                    return 'success';
                                });
                            }
                        }, function (chainValidator) {
                            var chainer = function (chainValidator_) {
                                var lastValidator = this;
                                if (chainValidator_ == null) {
                                    return lastValidator();
                                }

                                return chainer.bind(() => {
                                    return _.isFunction(lastValidator) ?
                                        lastValidator() === 'error' ? 'error' : chainValidator_() :
                                        chainValidator_();
                                });
                            };
                            return chainer(chainValidator);
                        });

                        propsForChild = propsForChild.set('validate', validationFn);
                        propsForChild = propsForChild.set('ref', child.ref);

                        propsForChild = propsForChild.toObject();
                        child = (
                            <ValidatedInput {...propsForChild}>{child.props.children}</ValidatedInput>
                        );
                        //child = React.cloneElement(child, propsForChild);
                        //child.isValid = validationFn;
                    }
                    return child;
                })}
            </form>
        );
    }
});

export default Form;
