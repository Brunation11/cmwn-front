import React from 'react';
import { Provider } from 'react-redux';
import Store from 'components/store';

// need this for smoke tests while components still reference store
class ProviderWrapper extends React.Component {
    render() {
        return (
            <Provider store={Store}>
                {this.props.route}
            </Provider>
        );
    }
}

export default ProviderWrapper;
