import React from 'react';
import _ from 'lodash';
import Shortid from 'shortid';
import {Input} from 'react-bootstrap';
import Moment from 'moment';

import 'components/dropdown_datepicker.scss';

class Page extends React.Component {
    constructor(props) {
        super(props);
        var month = 0, day = 0, year = 0;
        if (this.props.value != null) {
            month = Moment(this.props.value).month() + 1;
            day = Moment(this.props.value).date();
            year = Moment(this.props.value).year();
        }
        this.state = {
            month: month,
            day: day,
            year: year
        };
        this.setState = this.setState.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        var month = 0, day = 0, year = 0;
        if (nextProps.value != null) {
            month = Moment(nextProps.value).month() + 1;
            day = Moment(nextProps.value).date();
            year = Moment(nextProps.value).year();
            this.setState({
                month: month,
                day: day,
                year: year
            });
        }
    }

    getDate(nextState) {
        var month = nextState.month || this.state.month,
            day = nextState.day || this.state.day,
            year = nextState.year || this.state.year;
        if (!month || !day || !year) {
            return null;
        }
        return Moment(`${month}-${day}-${year}`).format('MM-DD-YYYY');
    }

    reset() {
        this.setState({
            month: 0,
            day: 0,
            year: 0
        });
    }

    renderMonthOptions() {
        var items = [
            <option value={0} key={Shortid.generate()} disabled>Select Month</option>
        ];

        _.each(Moment.monthsShort(), (month, i) => {
            items.push(
                <option value={i + 1} key={Shortid.generate()}>{month}</option>
            );
        });

        return items;
    }

    renderDayOptions() {
        var items = [
            <option value={0} key={Shortid.generate()} disabled>Select Day</option>
        ];

        _.each(Array((new Date(0, this.state.month, 0).getDate())), (day, i) => {
            items.push(
                <option value={i + 1} key={Shortid.generate()}>{i + 1}</option>
            );
        });

        return items;
    }

    renderYearOptions() {
        var items = [
            <option value={0} key={Shortid.generate()} disabled>Select Year</option>
        ];
        var currentYear = new Date().getFullYear();

        _.each(Array(150), (year, i) => {
            items.push(
                <option value={currentYear - i} key={Shortid.generate()}>{currentYear - i}</option>
            );
        });

        return items;
    }

    render() {
        return (
            <span className="form-inline dropdown-datepicker" >
                <label>Birthday:</label>
                <br />
                <Input
                    className="birthday-input"
                    type="select"
                    value={this.state.month}
                    placeholder="Month"
                    validate="required"
                    ref="monthInput"
                    name="monthInput"
                    onChange={e => {
                        this.setState({month: e.target.value});
                        this.props.onChange(this.getDate({month: e.target.value}));
                    }}
                    disabled={this.props.disabled}
                >{this.renderMonthOptions()}</Input>
                <Input
                    className="birthday-input"
                    type="select"
                    value={this.state.day}
                    placeholder="Day"
                    validate="required"
                    ref="dayInput"
                    name="dayInput"
                    onChange={e => {
                        this.setState({day: e.target.value});
                        this.props.onChange(this.getDate({day: e.target.value}));
                    }}
                    disabled={this.props.disabled}
                >{this.renderDayOptions()}</Input>
                <Input
                    className="birthday-input"
                    type="select"
                    value={this.state.year}
                    placeholder="Year"
                    validate="required"
                    ref="yearInput"
                    name="yearInput"
                    onChange={e => {
                        this.setState({year: e.target.value});
                        this.props.onChange(this.getDate({year: e.target.value}));
                    }}
                    disabled={this.props.disabled}
                >{this.renderYearOptions()}</Input>
                <br />
            </span>
        );
    }

}

Page.defaultProps = {onChange: _.identity};

export default Page;

