function KeyClose(){
    Key.call(this, arguments);

    this.id = "mlkeyboard-close";
    this.default_value = 'Close';
}

KeyClose.prototype = new Key();
KeyClose.prototype.constructor = KeyClose;

KeyClose.prototype.defaultClickAction = function() {
    this.keyboard.hideKeyboard();
}