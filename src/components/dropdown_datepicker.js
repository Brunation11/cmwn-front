import React from 'react';
import _ from 'lodash';
import Shortid from 'shortid';
import {Input} from 'react-bootstrap';
import Moment from 'moment';


var Page = React.createClass({
    getDefaultProps: function () {
        return {
            onChange: _.identity
        };
    },
    getInitialState: function () {
        var day = 0, month = 0, year = 0;
        if (this.props.value != null) {
            day = Moment(this.props.value).date();
            month = Moment(this.props.value).month() + 1;
            year = Moment(this.props.value).year();
        }
        return {
            year: year,
            month: month,
            day: day
        };
    },
    componentWillReceiveProps: function (nextProps) {
        var day = 0, month = 0, year = 0;
        if (nextProps.value != null) {
            day = Moment(nextProps.value).date();
            month = Moment(nextProps.value).month() + 1;
            year = Moment(nextProps.value).year();
            this.setState({
                year: year,
                month: month,
                day: day
            });
        }
    },
    getDate: function (nextState) {
        var day = nextState.day || this.state.day,
            month = nextState.month || this.state.month,
            year = nextState.year || this.state.year;
        return Moment(`${year}-${month}-${day}`).format('YYYY-MM-DD');
    },
    renderMonthOptions: function () {
        var items = [
            <option value={0} >Select Month</option>
        ];

        _.each(Moment.monthsShort(), (month, i) => {
            items.push(
                <option value={i + 1} key={Shortid.generate()}>{month}</option>
            );
        });

        return items;
    },
    renderDayOptions: function () {
        var items = [
            <option value={0} >Select Day</option>
        ];

        _.each(Array((new Date(0, this.state.month, 0).getDate())), (day, i) => {
            items.push(
                <option value={i + 1} key={Shortid.generate()}>{i + 1}</option>
            );
        });

        return items;
    },
    renderYearOptions: function () {
        var items = [
            <option value="" >Select Month</option>
        ];
        var currentYear = new Date().getFullYear();

        _.each(Array(150), (year, i) => {
            items.push(
                <option value={currentYear - i} key={Shortid.generate()}>{currentYear - i}</option>
            );
        });

        return items;
    },
    render: function () {
        return (
            <span className="form-inline dropdown_datepicker" >
                <Input
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
                <Input
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
                <br />
            </span>
        );
    }
});

export default Page;

