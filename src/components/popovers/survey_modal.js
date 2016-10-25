import React from 'react';
import {Modal} from 'react-bootstrap';
import {Panel} from 'react-bootstrap';
import _ from 'lodash';
import 'components/popovers/survey_modal.scss';

const HEADINGS = {
    'DATA': 'Survey Data',
    'CLICK': 'click to view ',
    'NODATA': 'No data to display at this time',
    'SCREEN3': 'WHAT ARE YOU MOST PASSIONATE ABOUT?',
    'SCREEN4': 'WHAT WORLD ISSUES DO YOU MOST LIKELY WANT TO SOLVE?',
    'SCREEN5': 'WHICH PICTURE SHOWS HOW POWERFUL YOU FEEL TO MAKE THE WORLD A BETTER PLACE?',
    'SCREEN6': 'WHAT QUALITIES MAKE SOMEBODY THE MOST POWERFUL AND LEAST POWERFUL?',
    'SCREEN7': 'YOU SEE YOUR CLASSMATE IS BEING TEASED BY A BULLY. HOW DO YOU FEEL ABOUT IT?',
    'SCREEN8':
        'YOU SEE SOMEBODY STOP TO HELP SOMEONE ELSE. CLICK ON AN EMOJI TO SHOW HOW THAT MAKES YOU FEEL?',
    'SCREEN9': 'A CLASSMATE YELLS AT YOU. CLICK ON AN EMOJI TO SHOW HOW THAT MAKES YOU FEEL.',
    'SCREEN10': 'A FRIEND SHARES A GAME WITH YOU. CLICK ON AN EMOJI TO SHOW HOW THAT MAKES YOU FEEL.',
    'SCREEN11': 'HAVE YOU EVER WORRIED ABOUT BEING BULLIED ONLINE?',
    'SCREEN12': 'WHAT DID YOU DO WHEN YOU WERE BULLIED?',
    'SCREEN13': 'HOW MUCH DO YOU KNOW ABOUT THE FOLLOWING TOPICS? Environment and climate change:',
    'SCREEN14': 'HOW MUCH DO YOU KNOW ABOUT THE FOLLOWING TOPICS? Endangered species:',
    'SCREEN15': 'HOW MUCH DO YOU KNOW ABOUT THE FOLLOWING TOPICS? Water conservation:',
    'SCREEN16': 'WHAT THINGS ARE YOU MOST INTERESTED IN LEARNING ABOUT?',
    'dropzone-0': 'Most Powerful:',
    'dropzone-1': 'Least Powerful:',
};

class SurveyModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: _.map((this.props.data === null ||
                this.props.data === {}) ? null : this.props.data, this.props.transform)
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
        return (
            <div>
                <a onClick={this.open}>
                    {`${HEADINGS.CLICK}${this.props.data.username}'s ${HEADINGS.DATA}`}
                </a>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Panel className="standard">
                        <div className="heading">
                            <a onClick={this.close} className="modal-close" title="close">X</a>
                            <h1>{`${HEADINGS.DATA} of ${this.props.data.username}`}</h1>
                        </div>
                        {_.map(this.props.data.data.data, function (value, key) {

                            var screen = 'SCREEN' + key.split('-')[1];

                            if (value.length === 0) return null;

                            if (_.isArray(value)) {
                                return (
                                    <div>
                                        <h4>{HEADINGS[screen]}</h4>
                                        <p>{value[0].replace(/-/g, ' ')}</p>
                                    </div>
                                );
                            }

                            if (screen === 'SCREEN6') {
                                return (
                                    <div>
                                        <h4> {HEADINGS[screen]} </h4>
                                        {_.map(value, function (qualities, dropzone){
                                            return (
                                                <div>
                                                    <p>{HEADINGS[dropzone]}</p>
                                                    <ol>
                                                        {_.map(qualities, function (quality){
                                                            return (
                                                                <li> {quality.replace(/-/g, ' ')} </li>
                                                            );
                                                        })}
                                                    </ol>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            }

                            return (
                                <div>
                                    <h4>{HEADINGS[screen]}</h4>
                                    <ol>
                                        {_.map(value, function (data){
                                            return (
                                                <li>{data.ref.replace(/-/g, ' ')}</li>
                                            );
                                        })}
                                    </ol>
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

SurveyModal.defaultProps = {
    header: 'Survey Data',
    transform: _.identity,
    showModal: false
};

export default SurveyModal;
