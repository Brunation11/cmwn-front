import React from 'react';
import {ButtonToolbar, OverlayTrigger, Panel, Popover, Button} from 'react-bootstrap';
import {Link} from 'react-router';
import Shortid from 'shortid';
import Moment from 'moment';

// import 'components/popover.scss';

var PopOver = React.createClass({
  getInitialState: function () {
    return {
      element: [],
      trigger: "hover",
      placement: "bottom"
    }
  },
  componentDidMount: function () {
    this.setState({element: this.props.element});
    this.setState({trigger: this.props.trigger});
    this.setState({placement: this.props.placement});
  },
  render: function () {
    var state = this.state;
    return (
      <ButtonToolbar>
        <OverlayTrigger trigger={state.trigger} rootClose placement={state.placement} overlay={<Popover title={state.element.title + "  |  earned: " + Moment(state.element.earned).format('MMM Do YYYY')}>{state.element.description}</Popover>}>
          <Link to="" key={Shortid.generate()}><img src={`/flips/${state.element.flip_id}.png`} ></img></Link>
        </OverlayTrigger>
      </ButtonToolbar>
    );
  }
});

export default PopOver;