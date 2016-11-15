import {Button, Input, Panel} from 'react-bootstrap';
import Shortid from 'shortid';

import FlipBoard from 'components/flipboard';
import GenerateDataSource from 'components/datasource';

import Layout from 'layouts/two_col';

import FlipBgDefault from 'media/flip-placeholder-white.png';

var mapStateToProps;
var Page;

const PAGE_UNIQUE_IDENTIFIER = 'god-mode-games';

const GAME_WRAPPER = GenerateDataSource('games', PAGE_UNIQUE_IDENTIFIER);

export class GodModeGames extends React.Component {
    renderFlip(item) {
        return (
            <div className="flip fill" id={item.game_id} key={Shortid.generate()}>
                <div className="item">
                    <object data={`${GLOBALS.MEDIA_URL}${TITLES[item.game_id]}`} type="image/gif" >
                        <img src={FlipBgDefault}></img>
                    </object>
                </div>
            </div>
        );
    }

    renderGameList() {
        if (this.state._links == null) {
            return null;
        }
        return (
           <GAME_WRAPPER>
               <FlipBoard
                   renderFlip={this.renderFlip.bind(this)}
                   header={'Games'}
                   id="game-flip-board"
               />
           </GAME_WRAPPER>
        );
    }

    render() {
        return (
           <Layout
               currentUser={this.props.currentUser}
               className={PAGE_UNIQUE_IDENTIFIER}
               navMenuId="navMenu"
           >
               {this.renderGameList()}
           </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = {};
    var loading = true;
    var currentUser = {};
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(GodModeGames);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

