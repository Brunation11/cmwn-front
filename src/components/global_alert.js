import SweetAlert from 'sweetalert2';

// Argument                    Default value       Description
// title                       null                The title of the modal. It can either be
// added to the object under the key
//                                                 "title" or passed as the first parameter
// of the function.
// text                        null                A description for the modal. It can
// either be added to the object under the key
//                                                 "text" or passed as the second parameter
// of the function.
// html                        null                A HTML description for the modal. If
// "text" and "html" parameters are provided
//                                                 in the same time, "text" will be used.
// type                        null                The type of the modal. SweetAlert2 comes
// with 5 built-in types which will show
//                                                 a corresponding icon animation: warning,
// error, success, info and question. It
//                                                 can either be put in the array under the
// key "type" or passed as the third
//                                                 parameter of the function.
// customClass                 null                A custom CSS class for the modal.
// animation                   true                If set to false, modal CSS animation
// will be disabled.
// allowOutsideClick           true                If set to false, the user can't dismiss
// the modal by clicking outside it.
// allowEscapeKey              true                If set to false, the user can't dismiss
// the modal by pressing the Escape key.
// showConfirmButton           true                If set to false, a "Confirm"-button will
// not be shown. It can be useful when
//                                                 you're using custom HTML description.
// showCancelButton            false               If set to true, a "Cancel"-button will
// be shown, which the user can click on to
//                                                 dismiss the modal.
// confirmButtonText           "OK"                Use this to change the text on the
// "Confirm"-button.
// cancelButtonText            "Cancel"            Use this to change the text on the
// "Cancel"-button.
// confirmButtonColor          "#3085d6"           Use this to change the background color
// of the "Confirm"-button (must be a HEX
//                                                 value).
// cancelButtonColor           "#aaa"              Use this to change the background color
// of the "Cancel"-button (must be a HEX
//                                                 value).
// confirmButtonClass          null                A custom CSS class for the
// "Confirm"-button.
// cancelButtonClass           null                A custom CSS class for the
// "Cancel"-button.
// buttonsStyling              true                Apply default swal2 styling to buttons.
// If you want to use your own classes (
//                                                 e.g. Bootstrap classes) set this
// parameter to false.
// reverseButtons              false               Set this parameter to true if you want
// to invert default buttons positions.
// showCloseButton             false               Set this parameter to true to show close
// button in top right corner of the
//                                                 modal.
// preConfirm                  null                Function to execute before confirm,
// should return Promise, see usage example.
// imageUrl                    null                Add a customized icon for the modal.
// Should contain a string with the path or
//                                                 URL to the image.
// imageWidth                  null                If imageUrl is set, you can specify
// imageWidth to describes image width in px.
// imageHeight                 null                Custom image height in px.
// imageClass                  null                A custom CSS class for the customized
// icon.
// timer                       null                Auto close timer of the modal. Set in ms
// (milliseconds).
// width                       500                 Modal window width, including paddings (
// box-sizing: border-box).
// padding                     20                  Modal window padding.
// background                  "#fff"              Modal window background (CSS background
// property).
// input                       null                Input field type, can be text, email,
// password, textarea, select, radio, and
//                                                 checkbox.
// inputPlaceholder            ""                  Input field placeholder.
// inputValue                  ""                  Input field initial value.
// inputOptions                {}                  If input parameter is set to select,
// you can provide options. Object keys will
//                                                 represent options values, object values
// will represent options text values.
// inputAutoTrim               true                Automatically remove whitespaces from
// both ends of a result string. Set this
//                                                 parameter to false to disable
// auto-trimming.
// inputValidator              null                Validator for input field, should
// return Promise, see usage example.
// inputClass                  null                A custom CSS class for the input field.

var GlobalAlert = function (args) {
    SweetAlert({
        animation: false,
        html: args.text,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: ('global-alert' +
                      (args.type ? (' ' + args.type) : '') +
                      (args.animate ? (' ' + args.animate) : '')
                      )
    });
    document.body.insertBefore(document.body.lastChild, document.body.firstChild);
};

export default GlobalAlert;
