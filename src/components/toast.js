import Humane from 'humane-js';

import GLOBALS from 'components/globals';

var Toast = Humane.create({
    baseCls: 'humane-flatty',
    clickToClose: true,
    waitForMove: true,
    timeoutAfterMove: GLOBALS.TOAST_DEFAULT_TIMEOUT
});

Toast.error = Toast.spawn({addnCls: 'humane-flatty-error'});
Toast.success = Toast.spawn({addnCls: 'humane-flatty-success'});

export default Toast;

