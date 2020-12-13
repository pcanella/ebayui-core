'use strict'; /**
               * Generic keydown handler used by more specific cases
               * @param {Array} keyCodes: List of acceptable keyCodes
               * @param {KeyboardEvent} e
               * @param {Function} callback
               */
function handleKeydown(keyCodes, e, callback) {
    var keyCode = e.charCode || e.keyCode;
    if (keyCodes.indexOf(keyCode) !== -1) {
        callback();
    }
}

// inverse of found keys
function handleNotKeydown(keyCodes, e, callback) {
    var keyCode = e.charCode || e.keyCode;
    if (keyCodes.indexOf(keyCode) === -1) {
        callback();
    }
}

// enter key
function handleEnterKeydown(e, callback) {
    handleKeydown([13], e, callback);
}

// space and enter keys
function handleActionKeydown(e, callback) {
    handleKeydown([32, 13], e, callback);
}

function handleEscapeKeydown(e, callback) {
    handleKeydown([27], e, callback);
}

function handleUpDownArrowsKeydown(e, callback) {
    handleKeydown([38, 40], e, callback);
}

function handleLeftRightArrowsKeydown(e, callback) {
    handleKeydown([37, 39], e, callback);
}

// only fire for character input, not modifier/meta keys (enter, escape, backspace, tab, etc.)
function handleTextInput(e, callback) {
    var keys = [
    9, // tab
    13, // enter key
    16, // shift
    17, // control
    18, // alt
    20, // caps lock
    27, // escape
    37, // left arrow
    38, // up arrow
    39, // right arrow
    40, // down arrow
    91 // "meta" key (Mac "command" key)
    ];
    handleNotKeydown(keys, e, callback);
}

function preventDefaultIfHijax(e, hijax) {
    if (hijax) {
        e.preventDefault();
    }
}

var handlers = [];
function addEventListener(_, handler) {
    if (handlers.length === 0) {
        window.addEventListener('resize', handleResize);
    }
    handlers.push(handler);
}
function removeEventListener(_, handler) {
    if (handlers.length === 1) {
        window.removeEventListener('resize', handleResize);
    }
    handlers.splice(handlers.indexOf(handler), 1);
}
function handleResize(ev) {
    window.removeEventListener('resize', handleResize);
    (window.requestAnimationFrame || window.setTimeout)(function () {
        if (handlers.length) {
            handlers.forEach(function (handler) {return handler(ev);});
            window.addEventListener('resize', handleResize);
        }
    }, 16);
}

module.exports = {
    handleEnterKeydown: handleEnterKeydown,
    handleActionKeydown: handleActionKeydown,
    handleEscapeKeydown: handleEscapeKeydown,
    handleUpDownArrowsKeydown: handleUpDownArrowsKeydown,
    handleLeftRightArrowsKeydown: handleLeftRightArrowsKeydown,
    handleTextInput: handleTextInput,
    preventDefaultIfHijax: preventDefaultIfHijax,
    resizeUtil: {
        addEventListener: addEventListener,
        removeEventListener: removeEventListener } };