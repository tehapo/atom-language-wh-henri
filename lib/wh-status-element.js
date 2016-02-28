'use babel';

import { Disposable, CompositeDisposable } from 'atom';

class WhStatusElement extends HTMLElement {

  createdCallback() {
    this.classList.add('inline-block');
    this.innerHTML = 'WH [<span id="total"></span> | <span id="balance"></span>]';

    this.saveSubscription = null;
    this.activeSubscription = atom.workspace.onDidChangeActivePaneItem((paneItem) => {
      if (paneItem && paneItem.getGrammar && this.isSupportedGrammar(paneItem.getGrammar())) {
        // Set up onDidSave callback to update on save.
        if (this.saveSubscription) {
          this.saveSubscription.dispose();
        }
        this.saveSubscription = paneItem.onDidSave(this.update.bind(this));

        // Display the status element and update now.
        this.style.display = '';
        this.update();
      } else {
        this.style.display = 'none';
      }
    });
  }

  destroy() {
    if (this.activeSubscription) {
      this.activeSubscription.dispose();
    }
    if (this.saveSubscription) {
      this.saveSubscription.dispose();
    }
  }

  update() {
    const lines = atom.workspace.getActiveTextEditor().getText().split('\n');
    let hours = 0.0;
    let weekDays = 0;
    lines.forEach((line) => {
      if (!line.startsWith('#')) {
        // Hours?
        const match = line.match(/^.* (.*)h$/);
        if (match !== null) {
          hours += parseFloat(match[1]);
        }

        // Weekday?
        if (line.match(/^\*(ma|ti|ke|to|pe).*/)) {
          weekDays++;
        }
      }
    });
    const balance = hours - weekDays * 7.5;
    this.querySelector('#total').textContent = hours;
    this.querySelector('#balance').textContent = (balance > 0 ? '+' : '') + balance;
    this.querySelector('#balance').className = 'text-' + (balance >= 0 ? 'success' : 'error');
  }

  isSupportedGrammar(grammar) {
    return grammar.scopeName === 'source.wh.txt';
  }
}
document.registerElement('wh-status', WhStatusElement);
