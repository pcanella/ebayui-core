'use strict';var rootSvg = void 0;

module.exports = require('marko-widgets').defineWidget({
    init: function init() {
        // Create a hidden svg to store all symbols on startup.
        if (!rootSvg) {
            rootSvg = document.createElement('svg');
            rootSvg.hidden = true;
            document.body.insertBefore(rootSvg, document.body.firstChild);
        }

        // If there were any symbols rendered then we move them to the svg above after rendering them.
        var defs = this.getEl('defs');

        if (defs) {
            var symbol = defs.querySelector('symbol');
            defs.parentNode.removeChild(defs);

            if (symbol) {
                rootSvg.appendChild(symbol);
            }
        }
    } });