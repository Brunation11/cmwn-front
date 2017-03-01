import React from 'react';
import {Button, Input, Panel} from 'react-bootstrap';
import Form from 'components/form';

import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Log from 'components/log';
import Shortid from 'shortid';
import ClassNames from 'classnames';

const FIELDS = [
    'thoroughfare',
    'premise',
    'locality',
    'sub_administrative_area',
    'postal_code',
    'country',
    'administrative_area'
];

const LABELS = {
    [FIELDS[0]]: 'Street Address',
    [FIELDS[1]]: 'Apt#/ Suite',
    [FIELDS[2]]: 'City/ Town',
    [FIELDS[3]]: 'County/ District',
    [FIELDS[4]]: 'Postal Code/ Zip Code',
    [FIELDS[5]]: 'Country',
    [FIELDS[6]]: 'State/ Province/ Region'
}

const REQUIRED = [
    'administrative_area',
    'locality',
    'postal_code',
    'thoroughfare',
];

const HEADINGS = {
    ADDRESS: 'Address',
    CONFIRM: 'Confirm Delete',
    DELETE: 'DELETE',
    ENTER: 'Enter',
    ADD: 'Address added to group successfully',
    DELETED: 'Address deleted successfully',
    SAVE: 'Address saved successfully'
}

const ERRORS = {
    ADD: 'Error while adding address to group',
    CREATE: 'Error creating address',
    PROBLEM: 'Problem occurred during execution',
    DELETE: 'Error while deleting the address',
    SAVE: 'Error while saving address.'
};

class Address extends React.Component {
    constructor(props) {
        super();
        if (props && props.data) {
            if (_.has(props, 'asMutable')) {
                props = props.asMutable({deep: true});
            }
            this.state = props.data;
            this.state.newAddress = false;
            this.state.confirmDelete = false;
        } else {
            this.state = {
                administrative_area: '',
                sub_administrative_area: '',
                locality: '',
                postal_code: '',
                thoroughfare: '',
                premise: '',
                newAddress: true,
            };
        }
    }

    componentWillReceiveProps(nextProps)
    {
        if (nextProps.data && nextProps.data.address_id) {
            nextProps = _.has(nextProps, 'asMutable') ? nextProps.asMutable({deep: true}) : nextProps;
            nextProps.data.newAddress = false;
            nextProps.data.confirmDelete = false;
            nextProps.data.countries = {};
        }

        if (
            this.props.currentUser &&
            this.props.currentUser._links &&
            this.props.currentUser._links.sa_settings
        ) {
            HttpManager.GET(
                this.props.currentUser._links.sa_settings.href
            ).then(res => {
                if (res.response && res.response.countries) {
                    if (nextProps.data) {
                        nextProps.data.countries = res.response.countries;
                        this.setState(nextProps.data);
                    } else {
                        this.setState({countries: res.response.countries});
                    }
                }
            });
        }
    }

    saveAddress() {
        var postData = {
            address_id: this.state.newAddress ? '' : this.state.address_id,
            country: this.state.country,
            administrative_area: this.state.administrative_area,
            locality: this.state.locality,
            postal_code: this.state.postal_code,
            thoroughfare: this.state.thoroughfare,
        };

        var url = this.state.newAddress ? this.props.currentUser._links.address.href : this.state._links.self.href;

        if (this.state.newAddress) {
            HttpManager.POST(
                url,
                postData
            ).then((res) => {
                if (res.response.address_id) {
                    HttpManager.POST(
                        this.props.links.group_address.href + '/' + res.response.address_id,
                        {foo: 'bar'}
                    ).then(() => {
                        Toast.success(HEADINGS.ADD);
                        this.setState(res.response);
                    }).catch(err => {
                        Toast.error(ERRORS.ADD + ' ' + err.message ? err.message : '');
                    });
                } else {
                    Toast.error(ERRORS.PROBLEM + ' ' + err.message ? err.message : '');
                }
            }).catch(err => {
                if (err.status === 422) {
                    var msg = (_.map(Object.keys(err.response.validation_messages), function(key) {
                        return LABELS[key];
                    })).join(', ');
                    msg += ' are required fields';
                    Toast.error(msg);
                } else {
                    Toast.error(ERRORS.CREATE + ' ' + err.message ? err.message : '');
                }
            });
        } else {
            HttpManager.PUT(
                url,
                postData
            ).then((res) => {
                Toast.success(HEADINGS.SAVE)
                if (res.response.address_id) {
                    this.setState(res.response);
                }
            }).catch(err => {
                Toast.error(ERRORS.SAVE)
            });
        }
    }

    deleteAddress() {
        if (!this.state.confirmDelete) {
            this.setState({confirmDelete: true});
        }
        else {
            HttpManager.DELETE(
                this.state._links.self.href
            ).then(() => {
                    Toast.success(HEADINGS.DELETED);
                    this.setState({
                        administrative_area: '',
                        sub_administrative_area: '',
                        locality: '',
                        postal_code: '',
                        thoroughfare: '',
                        premise: '',
                        newAddress: true,
                    });
                }
            ).catch(err => {
                Toast.error(ERRORS.DELETE + ' ' + err.message ? err.message : '');
            });
        }
    }

    renderInputField(inputField) {
        return (
            <Input
                type="text"
                defaultValue={this.state[inputField]}
                key={Shortid.generate()}
                placeholder={`${HEADINGS.ENTER} ${LABELS[inputField]}`}
                label={LABELS[inputField]}
                validate={REQUIRED.indexOf(inputField) === -1 ? "success" : "required"}
                validationEvent="onBlur"
                hasFeedBack
                ref={`${inputField}-input`}
                name={`${inputField}-input`}
                onBlur={e => {
                    var state = this.state;
                    state[inputField] = e.target.value;
                    this.setState(state);
                }}
            />
        );
    }

    renderCountry() {
        if (this.state.countries && this.state.countries !== {}) {
            return (
                <Input
                    type="select"
                    value={this.state.country}
                    placeholder=""
                    label={LABELS.country}
                    validate="required"
                    ref="countryInput"
                    name="countryInput"
                    onChange={
                        e => this.setState({
                            country: e.target.value
                        })
                    }
                >
                    {_.map(this.state.countries, function (country, countryCode) {
                        var text = countryCode;
                        if (_.has(country, 'name') && _.isString(country.name)) {
                            text = country.name;
                        }

                        return (<option key={Shortid.generate()} value={countryCode}>{text}</option>);
                    })}
                </Input>
            );
        }

        return this.renderInputField('country');
    }

    renderAdministrativeArea() {
        if (
            this.state.country &&
            this.state.countries &&
            _.has(this.state.countries, this.state.country) &&
            _.has(this.state.countries[this.state.country], 'states')
        ) {
            return (
                <Input
                    type="select"
                    value={this.state.administrative_area}
                    placeholder=""
                    label={LABELS.administrative_area}
                    validate="required"
                    ref="stateInput"
                    name="stateInput"
                    onChange={
                        e => this.setState({
                            administrative_area: e.target.value
                        })
                    }
                >
                    {_.map((this.state.countries[this.state.country]).states, function (state) {
                        var text = state.isoCode;
                        if (_.has(state, 'name') && _.isString(state.name)) {
                            text = state.name;
                        }

                        return (<option key={Shortid.generate()} value={state.isoCode}>{text}</option>);
                    })}
                </Input>
            );
        }

        return this.renderInputField('administrative_area');
    }

    render() {
        return (
            <Panel header={`${HEADINGS.ADDRESS}`} className="standard">
                <Form>
                    {_.map(
                        _.filter(FIELDS, field => {
                            return field !== 'administrative_area' && field !== 'country'   ;
                        }),
                        addressField => {
                            return (this.renderInputField(addressField));
                        }
                    )}
                    {this.renderAdministrativeArea()}
                    {this.renderCountry()}
                    <Button
                        className="btn standard purple save-btn"
                        onClick={this.saveAddress.bind(this)}
                    >
                        {this.state.newAddress ? 'CREATE' : 'SAVE'}
                    </Button>
                    <Button
                        className={ClassNames('btn', 'standard', 'purple', 'delete-btn', {
                            hidden: this.state.newAddress || !this.state.address_id
                        })}
                        onClick={this.deleteAddress.bind(this)}
                    >
                        {this.state.confirmDelete ? HEADINGS.CONFIRM : HEADINGS.DELETE}
                    </Button>
                </Form>
            </Panel>
        );
    }
}

export default Address;

