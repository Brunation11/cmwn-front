import React from 'react'; //eslint-disable-line no-unused-vars
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import { createDevTools } from 'redux-devtools';

var isAvailable = window.__cmwn.MODE === 'dev' || window.__cmwn.MODE === 'development' || window.__cmwn.MODE === 'local';
var isVisible = window.__cmwn.MODE === 'local';
var DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h"
               defaultIsVisible={isVisible}
               changePositionKey="ctrl-q">
    <LogMonitor theme="tomorrow" />
  </DockMonitor>
);

if (!isAvailable) {
    DevTools = null;
}

export default DevTools;


