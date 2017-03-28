import React from 'react';
import {Modal} from 'react-bootstrap';

import 'components/popups/code_change.scss';

const HEADER = 'BE SURE!';
const COPY = (
    <span>
        To share this code with the user.
        <br />
        It will only be active for <span className="callout">24 hours!</span>
    </span>
);

export default class CodeChangePopup extends React.Component {
    constructor() {
        super();

        this.state = {
            open: false
        };
    }

    showModal() {
        this.setState({open: true});
    }

    hideModal() {
        this.setState({open: false});
    }

    render() {
        return (
            <Modal
                className="code-change-modal"
                show={this.state.open}
                onHide={this.hideModal.bind(this)}
                keyboard={false}
                backdrop="static"
                id="code-change-modal"
            >
                <Modal.Body>
                    <div>
                        <h1>{this.props.header || HEADER}</h1>
                        <div className="copy">
                            {this.props.copy || COPY}
                        </div>
                        <button className="close-modal" onClick={this.hideModal.bind(this)}>OK</button>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
