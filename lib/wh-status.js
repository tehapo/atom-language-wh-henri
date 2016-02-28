'use babel';

import './wh-status-element.js';

export default {

  statusBarTile: null,

  activate() { },

  deactivate() {
    if (this.statusBarTile) {
      this.statusBarTile.getItem().destroy();
      this.statusBarTile.destroy();
      this.statusBarTile = null;
    }
  },

  consumeStatusBar(statusBar) {
    var statusElement = document.createElement('wh-status');
    this.statusBarTile = statusBar.addRightTile({
      item: statusElement,
      priority: 100
    });
  }

};
