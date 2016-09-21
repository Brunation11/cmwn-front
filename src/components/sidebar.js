import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';

import SiteNav from 'components/site_nav';
//import FriendList from 'components/friend_list';
import ProfileImage from 'components/profile_image';

import 'components/sidebar.scss';

const WELCOME = 'Welcome';
const USERNAMEREF = 'usernamelink';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {fontSize: 25};
    }
    componentDidMount() {
        //offsetHeight cannot be accurately retrieved from reactdom
        /* istanbul ignore if*/
        if (
            this.refs[USERNAMEREF] &&
            this.state.fontSize >= 12 &&
            this.refs &&
            ReactDOM.findDOMNode(this.refs[USERNAMEREF]).offsetHeight > 2 * this.state.fontSize
        ) {
            this.setState({fontSize: this.state.fontSize - 1});
        }

    }
    componentWillUpdate(nextProps, nextState) {
        /* istanbul ignore if*/
        if (
            this.refs[USERNAMEREF] &&
            this.state.fontSize >= 12 &&
            nextState.fontSize === this.state.fontSize &&
            this.refs &&
            ReactDOM.findDOMNode(this.refs[USERNAMEREF]).offsetHeight > 2 * this.state.fontSize
        ) {
            this.setState({fontSize: this.state.fontSize - 1});
        }

    }
    componentDidUpdate() {
        /* istanbul ignore if*/
        if (
            this.refs[USERNAMEREF] &&
            this.state.fontSize >= 12 &&
            this.refs &&
            ReactDOM.findDOMNode(this.refs[USERNAMEREF]).offsetHeight > 2 * this.state.fontSize
        ) {
            this.setState({fontSize: this.state.fontSize - 1});
        }
    }
    renderWelcome() {
        return (
            <div>
                <p className="welcome">{WELCOME}</p>
                <p className={ClassNames('username')} style={{'fontSize': this.state.fontSize}}>
                    <a ref={USERNAMEREF} Click={this.attemptNavigate}>
                        {this.props.currentUser.username}
                    </a>
                </p>
            </div>
        );
    }
    render() {
        if (this.props.currentUser == null || (
                this.props.currentUser.username == null ||
                this.props.currentUser.username.toLowerCase() === 'null'
            )
        ) {
            return null;
        }

        return (
            <div id={this.props.navMenuId} className={'sidebar ' + (this.props.menuIsOpen ? 'open' : '')}>
                {this.renderWelcome()}
                <ProfileImage data={this.props.currentUser} currentUser={this.props.currentUser} />
                <SiteNav currentUser={this.props.currentUser}
                    data={this.props.currentUser._links.asMutable()} />

                {''/*<FriendList />*/}
            </div>
        );
    }
}

export default Sidebar;

