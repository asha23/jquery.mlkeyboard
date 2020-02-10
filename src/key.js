function Key(params) {

	if (Object.prototype.toString.call(params) == "[object Arguments]") {
		this.keyboard = params[0];
	} else {
		this.keyboard = params;
	}

	this.$key = $("<li/>");
	this.current_value = null;

}

Key.prototype.render = function () {

	if (this.id) {
		this.$key.attr("id", this.id);
	}

	return this.$key;
};

Key.prototype.setCurrentValue = function () {

	if (this.keyboard.upperRegister()) {
		this.current_value = this.preferences.u ? this.preferences.u : this.default_value;
	} else {
		this.current_value = this.preferences.d ? this.preferences.d : this.default_value;
		
	}
	this.$key.text(this.current_value);
};

Key.prototype.setCurrentAction = function () {
	var _this = this;

	this.$key.unbind("click.mlkeyboard");
	this.$key.bind("click.mlkeyboard", function () {
		_this.keyboard.keep_focus = true;

		if (typeof (_this.preferences.onClick) === "function") {
			_this.preferences.onClick(_this);
		} else {
			_this.defaultClickAction();
		}
	});
};

Key.prototype.defaultClickAction = function () {
	this.keyboard.destroyModifications();

	if (this.is_modificator) {
		if(!this.no_char) {
			this.keyboard.deleteChar();
			this.keyboard.printChar(this.current_value);
		}
	} else {
		if(!this.no_char) {
			this.keyboard.printChar(this.current_value);
		}
	}

	if (this.preferences.m && Object.prototype.toString.call(this.preferences.m) === '[object Array]') {
		this.showModifications();
	}

	if (this.keyboard.active_shift) this.keyboard.toggleShift(false);
};

Key.prototype.showModifications = function () {
	var _this = this;

	this.keyboard.modifications = [];

	$.each(this.preferences.m, function (i, modification) {
		var key = new Key(_this.keyboard);
		key.is_modificator = true;
		key.preferences = modification;
		_this.keyboard.modifications.push(key);
	});

	this.keyboard.showModifications(this);
};

Key.prototype.toggleActiveState = function () {
	if (this.isActive()) {
		this.$key.addClass('active');
	} else {
		this.$key.removeClass('active');
	}
};

Key.prototype.isActive = function () {
	return false;
};

Key.prototype.setNumPad = function(classPref) {

	if(classPref === true) {
		this.$key.addClass('num-pad-key');
	} 

	if(this.$key.hasClass('num-pad-key') === false || this.$key.hasClass('num-pad-key') === undefined) {
		this.$key.hide();
	} 

	if(this.$key.prop('id') === 'mlkeyboard-close') {
		$('#mlkeyboard-left-arrow').show();
		$('#mlkeyboard-right-arrow').show();
		$('#mlkeyboard-close').show();
	}
}

Key.prototype.resetNumPad = function(emailPref) {
	this.$key.show();
	this.$key.removeClass('num-pad-key');
	this.$key.removeClass('num-pad-key-extras');

	if(emailPref === true) {
		this.$key.show();
	}
}

Key.prototype.defaultHide = function(){
	this.$key.hide();
}

Key.prototype.defaultShow = function(){
	this.$key.show();
}