'use babel';

import './wh-status-element.js';
import { CompositeDisposable } from 'atom';

export default {

  statusBarTile: null,
  dayNames: ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'],

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-text-editor[data-grammar~="wh"]', {
      'language-wh-henri:start-a-new-day': () => this.insertDayStart()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    if (this.statusBarTile) {
      this.statusBarTile.getItem().destroy();
      this.statusBarTile.destroy();
      this.statusBarTile = null;
    }
  },

  floorMinutes(minutes, accuracy = 5) {
    return minutes - (minutes % accuracy);
  },

  zeroPad(value) {
    return (value < 10) ? '0' + value : value;
  },

  insertDayStart() {
    const editor = atom.workspace.getActiveTextEditor();
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = this.zeroPad(this.floorMinutes(currentTime.getMinutes()));
    const weekDay = this.dayNames[currentTime.getDay()];
    editor.insertText(`# klo ${hours}.${minutes}\n`);
    editor.insertText(`*${weekDay} ${currentTime.getDate()}.${currentTime.getMonth() + 1}.\n`);
  },

  consumeStatusBar(statusBar) {
    var statusElement = document.createElement('wh-status');
    this.statusBarTile = statusBar.addRightTile({
      item: statusElement,
      priority: 100
    });
  }

};
