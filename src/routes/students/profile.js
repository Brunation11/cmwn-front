import React from 'react';
import _ from 'lodash';
import {Panel} from 'react-bootstrap';

import Layout from 'layouts/two_col';
import FlipBoard from 'components/flipboard';
import Authorization from 'components/authorization';

import FlipBgDefault from 'media/flip-placeholder-white.png';
import FireBg from 'media/_FIRE_title.jpg';
import FoodBg from 'media/_Food_Saver_Superhero_title.jpg';
import PrintPg from 'media/_PrintMaster_title.jpg';
import PigBg from 'media/_virtual_piggybank_title.jpg';

import 'routes/students/profile.scss';

const HEADINGS = {
    ACTION: 'Info',
    ARCADE: 'Take Action'
};

var Page = React.createClass({
    renderFlip: function (item, i){
        var bg;
        var rnd = Math.floor(Math.random() * 1000) % 5;
        /* eslint-disable curly */
        if (i === 0) bg = PigBg;
        else if (i === 1) bg = FireBg;
        else if (i === 2) bg = FoodBg;
        else if (i === 3) bg = PrintPg;
        else if (rnd === 0) bg = FlipBgDefault;
        else if (rnd === 1) bg = FireBg;
        else if (rnd === 2) bg = FoodBg;
        else if (rnd === 3) bg = PrintPg;
        else bg = PigBg;
        /* eslint-enable curly */
        return (
            <div className="flip"><a href={item.url}><img src={bg}></img></a></div>
        );
    },
    render: function () {
        return (
           <Layout className="profile">
               <Panel header={HEADINGS.ACTION + ' - ' + Authorization.currentUser.fullname} className="standard">
               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec arcu id massa fringilla condimentum. Nam ornare eget nibh vel laoreet. Donec tincidunt hendrerit nunc, varius facilisis lacus placerat eget. Sed pretium interdum pretium. Pellentesque bibendum libero eget elit consectetur iaculis. Praesent nec mi fringilla, ornare nunc at, auctor velit. Mauris gravida ipsum nisi, eu elementum erat elementum quis.

Suspendisse in maximus mauris, ut mollis libero. Nunc ut ullamcorper mauris, a interdum nisl. Vivamus posuere porttitor magna. Cras varius metus venenatis condimentum cursus. Aenean ac lacus viverra dui tincidunt suscipit. Duis condimentum velit sit amet imperdiet efficitur. Praesent sit amet varius tortor, et elementum nisl. Donec ligula ex, lacinia a accumsan non, placerat sed justo. Morbi in dui a nunc ullamcorper gravida vel sit amet diam. Fusce eget libero suscipit, vestibulum arcu non, porta sem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus mauris quam, viverra vitae tellus ac, porta bibendum felis.
               </Panel>
               <FlipBoard renderFlip={this.renderFlip} heading={HEADINGS.ACTION} data={_.map(Array(11), i => ({url: i}))} />
           </Layout>
        );
    }
});

export default Page;

