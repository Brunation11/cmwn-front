import {Button} from 'react-bootstrap';

const LABELS = {
    ABOUT: 'About this game',
    LEFT: 'Left',
    RIGHT: 'Right'
};

const COMPONENT_UNIQUE_IDENTIFIER = 'featured-game';

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0;
        };
    }
    renderSlides() {
        var slides;
        return slides;
    }
    render() {
        if (this.props.data == null) return null;

        return (
            <div className={COMPONENT_UNIQUE_IDENTIFIER} >
                <div className="control-sweater">
                    <Button className="left" >{LABEL.SLEFT}</Button>
                    <div className="slide-container">
                        {this.renderSlides}
                    </div>
                    <Button className="right" >{LABEL.RIGHT}</Button>
                </div>
            </div>
        );
    }
}

Component.defaultProps = {
};

Component.identifier = COMPONENT_UNIQUE_IDENTIFIER;

export default Component;

