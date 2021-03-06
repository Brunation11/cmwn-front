import React from 'react';
import {Modal} from 'react-bootstrap';
import {Panel} from 'react-bootstrap';
import _ from 'lodash';
import 'components/survey_modal.scss';
import Shortid from 'shortid';

const HEADINGS = {
    'DATA': 'Survey Data',
    'CLICK': 'click to view ',
    'NODATA': 'No data to display at this time',
    'dropzone-0': 'Most Powerful:',
    'dropzone-1': 'Least Powerful:',
};

const HEADINGS_NEW = {
    'SCREEN3': 'WHAT ARE YOU MOST PASSIONATE ABOUT?',
    'SCREEN4': 'WHAT WORLD ISSUES DO YOU MOST LIKELY WANT TO SOLVE?',
    'SCREEN5': 'WHICH PICTURE SHOWS HOW POWERFUL YOU FEEL TO MAKE THE WORLD A BETTER PLACE?',
    'SCREEN6': 'YOU SEE YOUR CLASSMATE IS BEING TEASED BY A BULLY. HOW DO YOU FEEL ABOUT IT?',
    'SCREEN7':
        'YOU SEE SOMEBODY STOP TO HELP SOMEONE ELSE. CLICK ON AN EMOJI TO SHOW HOW THAT MAKES YOU FEEL?',
    'SCREEN8': 'A CLASSMATE YELLS AT YOU. CLICK ON AN EMOJI TO SHOW HOW THAT MAKES YOU FEEL.',
    'SCREEN9': 'A FRIEND SHARES A GAME WITH YOU. CLICK ON AN EMOJI TO SHOW HOW THAT MAKES YOU FEEL.',
    'SCREEN10': 'HAVE YOU EVER WORRIED ABOUT BEING BULLIED ONLINE?',
    'SCREEN11': 'WHAT DID YOU DO WHEN YOU WERE BULLIED?',
    'SCREEN12': 'HOW MUCH DO YOU KNOW ABOUT THE FOLLOWING TOPICS? Environment and climate change:',
    'SCREEN13': 'HOW MUCH DO YOU KNOW ABOUT THE FOLLOWING TOPICS? Endangered species:',
    'SCREEN14': 'HOW MUCH DO YOU KNOW ABOUT THE FOLLOWING TOPICS? Water conservation:',
    'SCREEN15': 'WHAT THINGS ARE YOU MOST INTERESTED IN LEARNING ABOUT?',
    'SCREEN16': 'WHAT QUALITIES MAKE SOMEBODY THE MOST POWERFUL AND LEAST POWERFUL?',
};

const HEADINGS_OLD = {
    'SCREEN3': 'WHAT ARE YOU MOST PASSIONATE ABOUT?',
    'SCREEN4': 'WHAT WORLD ISSUES DO YOU MOST LIKELY WANT TO SOLVE?',
    'SCREEN5': 'WHICH PICTURE SHOWS HOW POWERFUL YOU FEEL TO MAKE THE WORLD A BETTER PLACE?',
    'SCREEN6': 'WHAT QUALITIES MAKE SOMEBODY THE MOST POWERFUL AND LEAST POWERFUL?',
    'SCREEN7': 'YOU SEE YOUR CLASSMATE IS BEING TEASED BY A BULLY. HOW DO YOU FEEL ABOUT IT?',
    'SCREEN8':
        'YOU SEE SOMEBODY STOP TO HELP SOMEONE ELSE. CLICK ON AN EMOJI TO SHOW HOW THAT MAKES YOU FEEL?',
    'SCREEN10': 'A FRIEND SHARES A GAME WITH YOU. CLICK ON AN EMOJI TO SHOW HOW THAT MAKES YOU FEEL.',
    'SCREEN9': 'A CLASSMATE YELLS AT YOU. CLICK ON AN EMOJI TO SHOW HOW THAT MAKES YOU FEEL.',
    'SCREEN11': 'HAVE YOU EVER WORRIED ABOUT BEING BULLIED ONLINE?',
    'SCREEN12': 'WHAT DID YOU DO WHEN YOU WERE BULLIED?',
    'SCREEN13': 'HOW MUCH DO YOU KNOW ABOUT THE FOLLOWING TOPICS? Environment and climate change:',
    'SCREEN14': 'HOW MUCH DO YOU KNOW ABOUT THE FOLLOWING TOPICS? Endangered species:',
    'SCREEN15': 'HOW MUCH DO YOU KNOW ABOUT THE FOLLOWING TOPICS? Water conservation:',
    'SCREEN16': 'WHAT THINGS ARE YOU MOST INTERESTED IN LEARNING ABOUT?',
};

class SurveyModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            username: props.username,
            data: props.data.data === null || props.data.data === {} ? null : props.data.data,
            showModal: false
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            showModal: nextProps.showModal
        });
    }

    open() {
        this.setState({ showModal: true });
    }

    close() {
        this.setState({ showModal: false });
    }

    render() {
        var version = HEADINGS_NEW;

        if (this.state.data && this.state.data['screen-6'] &&
            _.isArray(this.state.data['screen-6']['dropzone-0'])) {
            version = HEADINGS_OLD;
        }
        return (
            <div>
                <a onClick={this.open}>
                    {`${HEADINGS.CLICK}${this.state.username}'s ${HEADINGS.DATA}`}
                </a>
                <Modal className="survey-modal" show={this.state.showModal} onHide={this.close}>
                    <Panel className="standard">
                        <div className="heading">
                            <a onClick={this.close} className="modal-close" title="close">X</a>
                            <h1>{`${HEADINGS.DATA} of ${this.state.username}`}</h1>
                        </div>
                        {_.map(this.state.data, function (value, key) {

                            var screen = 'SCREEN' + key.split('-')[1];
                            var body = null;

                            if (!value || value.length === 0) return null;

                            if (_.isArray(value)) {
                                body = <p>{value[0].replace(/-/g, ' ')}</p>;
                            }

                            if (body === null && Object.keys(value).length > 0) {
                                if ((Object.keys(value)).length === 2 && _.isArray(value['dropzone-0'])) {
                                    body = _.map(value, function (qualities, dropzone){
                                        return (
                                            <div key={Shortid.generate()}>
                                                <p>{HEADINGS[dropzone]}</p>
                                                <ol>
                                                    {_.map(qualities, function (quality){
                                                        return (
                                                            <li key={Shortid.generate()}>
                                                                {quality.replace(/-/g, ' ')}
                                                            </li>
                                                        );
                                                    })}
                                                </ol>
                                            </div>
                                        );
                                    });

                                } else {
                                    body = <ol key={Shortid.generate()}>
                                            {_.map(value, function (data){
                                                return (
                                                    <li
                                                        key={Shortid.generate()}
                                                    >
                                                        {data.ref.replace(/-/g, ' ')}
                                                    </li>
                                                );
                                            })}
                                            </ol>;
                                }
                            }

                            return (
                                <div key={Shortid.generate()}>
                                    <h4 key="heading">{version[screen]}</h4>
                                    {body}
                                </div>
                            );
                        })}
                        <br/>
                    </Panel>
                </Modal>
            </div>
        );
    }
}

export default SurveyModal;
