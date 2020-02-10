function KeyClear() {
    Key.call(this, arguments);
  
    this.id = "mlkeyboard-clear";
    this.default_value = '';
    this.no_char = true;
  }
  
  KeyClear.prototype = new Key();
  KeyClear.prototype.constructor = KeyClear;