function KeyRightArrow() {
    Key.call(this, arguments);
  
    this.id = "mlkeyboard-right-arrow";
    this.default_value = '→';
    this.no_char = true;
  }
  
  KeyRightArrow.prototype = new Key();
  KeyRightArrow.prototype.constructor = KeyRightArrow;