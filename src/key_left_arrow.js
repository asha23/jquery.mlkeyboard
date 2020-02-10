function KeyLeftArrow() {
    Key.call(this, arguments);
  
    this.id = "mlkeyboard-left-arrow";
    this.default_value = '←';
    this.no_char = true;
  }
  
  KeyLeftArrow.prototype = new Key();
  KeyLeftArrow.prototype.constructor = KeyLeftArrow;