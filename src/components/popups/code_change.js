import React from 'react';
import {Modal} from 'react-bootstrap';

// import 'components/popups/code_change.scss';

const HEADER = 'BE SURE!';
const COPY = 'To share this code with the user. It will only be active for 24 hours!';

export default class CodeChangePopup extends React.Component {
    constructor() {
        super();

        this.state = {
            open: true
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
                        <h1>{HEADER}</h1>
                        <span>{COPY}</span>
                        <button className="close-modal" onClick={this.hideModal}>OK</button>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
