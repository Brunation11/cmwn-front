import _ from 'lodash';
import {Button} from 'react-bootstrap';

const LABELS = {
    ABOUT: 'About this game',
    FLAG: 'Featured Games',
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
        slides = _.map(this.props.data, i => {
            return (
                <div className="slide" onClick={this.props.launchGame.bind(null, i.gameId)}>
                    <div className="labels">
                        <span>{LABELS.ABOUT}</span>
                        <span>{i.description}</span>
                    </div>
                </div>
            );
        });
        return slides;
    }
    render() {
        if (this.props.data == null) return null;

        return (
            <div className={COMPONENT_UNIQUE_IDENTIFIER} >
                <div className="featured-flag">{LABELS.FLAG}</div>
                <div className="control-sweater">
                    <Button className="left" >{LABELS.LEFT}</Button>
                    <div className="slide-container">
                        {this.renderSlides}
                    </div>
                    <Button className="right" >{LABELS.RIGHT}</Button>
                </div>
            </div>
        );
    }
}

Component.defaultProps = {
    launchGame: _.identity
};

Component.identifier = COMPONENT_UNIQUE_IDENTIFIER;
export default Component;

