function Keyboard(selector, options) {

	this.defaults = {
		layout: 'en_US',
		active_shift: true,
		active_caps: false,
		is_hidden: true,
		key_count: 61,
		open_speed: 300,
		close_speed: 100,
		show_on_focus: true,
		hide_on_blur: true,
		trigger: undefined,
		enabled: true,
		is_num_pad: false
	};

	this.global_options = $.extend({}, this.defaults, options);
	this.options = $.extend({}, {}, this.global_options);

	this.keys = [];

	this.$keyboard = $("<div class='default-container' />").attr("id", "mlkeyboard");
	this.$modifications_holder = $("<ul/>").addClass('mlkeyboard-modifications');
	this.$current_input = $(selector);
}

Keyboard.prototype.init = function () {
	this.$keyboard.append(this.renderKeys());
	this.$keyboard.append(this.$modifications_holder);

	this.active_shift = this.options.active_shift;
	this.active_caps = this.options.active_caps;

	$("body").append(this.$keyboard);

	if (this.options.is_hidden) {
		this.$keyboard.hide();
	}

	this.setUpKeys(false);

	_this = this;

	$('#mlkeyboard-left-arrow').click(function(e){
		e.preventDefault();
		_this.doTabLeft(_this.tab_index, _this.$current_input, _this.focussed_element);
		
	})

	$('#mlkeyboard-right-arrow').click(function(e){
		e.preventDefault();
		_this.doTabRight(_this.tab_index, _this.$current_input, _this.focussed_element);
	})
};

Keyboard.prototype.setUpKeys = function (numeric) {

	var _this = this;

	this.numkeys = this.keys.length;

	$.each(this.keys, function (i, key) {
		key.preferences = mlKeyboard.layouts[_this.options.layout][i];

		classPref = key.preferences['np'];
		emailPref = key.preferences['email'];
		defaultHide = key.preferences['hide']

		if(numeric) {
			key.setNumPad(classPref);

			if(defaultHide === true) {
				key.defaultShow();
			}
		} else {
			key.resetNumPad(emailPref)

			if(defaultHide === true) {
				key.defaultHide();
			}
		}
		
		key.setCurrentValue();
		key.setCurrentAction();
		key.toggleActiveState();

	});
};

Keyboard.prototype.renderKeys = function () {

	var $keys_holder = $("<ul />");
	for (var i = 0; i <= this.options.key_count; i++) {
		var key;


		switch (i) {
			case 15:
				key = new KeyDelete(this); // Delete
			break;
			case 16:
				key = new KeyTab(this);
			break;
			case 30:
				key = new KeyCapsLock(this);
			break;
			case 42:
				key = new KeyReturn(this);
			break;
			case 43:
				key = new KeyShift(this, "left");
			break;
			case 54:
				key = new KeyShift(this, "right");
			break;
			case 56:
				key = new KeySpace(this);
			break;
			case 58:
				key = new KeyClear(this);
			break;
			case 59:
				key = new KeyLeftArrow(this);
			break;
			case 60:
				key = new KeyClose(this);
			break;
			case 61:
				key = new KeyRightArrow(this);
			break;
			default:
				key = new Key(this);
			break;
		}

		
		this.keys.push(key);
		$keys_holder.append(key.render());
	}

	return $keys_holder;
};

Keyboard.prototype.setUpFor = function ($input) {
	var _this = this;

	$input_context = $input.context.type;

	if (this.options.show_on_focus && $input_context !== 'checkbox') {
		$input.bind('focus', function () { 
			_this.showKeyboard($input); 
		});
	}

	if (this.options.hide_on_blur && $input_context !== 'checkbox') {

		$input.bind('blur', function () {
			var VERIFY_STATE_DELAY = 500;

			console.log('blur')
			
			clearTimeout(_this.blur_timeout);

			_this.blur_timeout = setTimeout(function () {
				if (!_this.keep_focus) { 
					_this.hideKeyboard(); 
				} else { 
					_this.keep_focus = false; 
				}
			}, VERIFY_STATE_DELAY);

			
		});
	}

	if (this.options.trigger && $input_context !== 'checkbox') {
		var $trigger = $(this.options.trigger);

		$trigger.bind('click', function (e) {
			e.preventDefault();

			if (_this.isVisible) { 
				_this.hideKeyboard(); 
			} else {
				_this.showKeyboard($input);
				$input.focus();
			}
		});
	}
};

Keyboard.prototype.showKeyboard = function ($input) {
	var input_changed = !this.$current_input || $input[0] !== this.$current_input[0];

	$input_context = $input.context.type;

	if (!this.keep_focus || input_changed) {

		if (input_changed) {
			this.keep_focus = true;
		}

		this.tab_index = null;
		this.$current_input = $input;
		this.tab_index = this.$current_input.index('.tabbable');

		this.options = $.extend({}, this.global_options, this.inputLocalOptions());

		if (!this.options.enabled) {

			this.keep_focus = true;
			var that = this;

  			setTimeout(function(){ 
				that.selectionStart = that.selectionEnd = 10000; 
			}, 0);
		}

		if (this.$current_input.val() !== '') {
			this.options.active_shift = false;
		}

		charCount = this.$current_input.val().length;

		if(this.$current_input.hasClass('numeric')) {
			this.numeric = true
			this.$keyboard.removeClass();
			this.$keyboard.addClass('numeric-container');
			this.unshift();
			this.setUpKeys(this.numeric);
			
		} else {
			this.numeric = false;
			this.$keyboard.removeClass();
			this.$keyboard.addClass('default-container');

			if(this.$current_input.hasClass('email-field')) {
				this.$keyboard.removeClass();
				this.$keyboard.addClass('email-container');
			} else {
				this.$keyboard.removeClass();
				this.$keyboard.addClass('default-container');
			}

			if(charCount <= 1) {
				this.resetShift();
			} else {
				this.unshift();
			}

			this.setUpKeys(this.numeric);
		}

		if (this.options.is_hidden) {
			this.isVisible = true;
			this.$keyboard.slideDown(this.options.openSpeed);
		}

		
	}
};

Keyboard.prototype.hideKeyboard = function () {
	if (this.options.is_hidden) {
		this.isVisible = false;
		this.$keyboard.slideUp(this.options.closeSpeed);
	}
};

Keyboard.prototype.inputLocalOptions = function () {
	var options = {};

	for (var key in this.defaults) {
		var input_option = this.$current_input.attr("data-mlkeyboard-" + key);

		if (input_option == "false") {
			input_option = false;
		} else if (input_option == "true") {
			input_option = true;
		}
		if (typeof input_option !== 'undefined') { 
			options[key] = input_option; 
		}
	}

	return options;
};

Keyboard.prototype.printChar = function (char) {

	var selStart = this.$current_input[0].selectionStart;
	var selEnd = this.$current_input[0].selectionEnd;
	var textAreaStr = this.$current_input.val();
	var value = textAreaStr.substring(0, selStart) + char + textAreaStr.substring(selEnd);

	this.$current_input.val(value).focus();
	this.$current_input[0].selectionStart = selStart + 1, this.$current_input[0].selectionEnd = selStart + 1;

};

Keyboard.prototype.deleteChar = function () {
	var selStart = this.$current_input[0].selectionStart;
	var selEnd = this.$current_input[0].selectionEnd;

	var textAreaStr = this.$current_input.val();
	var after = textAreaStr.substring(0, selStart - 1);
	var value = after + textAreaStr.substring(selEnd);
	this.$current_input.val(value).focus();
	this.$current_input[0].selectionStart = selStart - 1, this.$current_input[0].selectionEnd = selStart - 1;

};

Keyboard.prototype.showModifications = function (caller) {
	var _this = this,
		holder_padding = parseInt(_this.$modifications_holder.css('padding'), 10),
		top, left, width;

	$.each(this.modifications, function (i, key) {
		_this.$modifications_holder.append(key.render());

		key.setCurrentValue();
		key.setCurrentAction();
	});

	// TODO: Remove magic numbers
	width = (caller.$key.width() * _this.modifications.length) + (_this.modifications.length * 6);
	top = caller.$key.position().top - holder_padding;
	left = caller.$key.position().left - _this.modifications.length * caller.$key.width() / 2;

	this.$modifications_holder.one('mouseleave', function () {
		_this.destroyModifications();
	});

	this.$modifications_holder.css({
		width: width,
		top: top,
		left: left
	}).show();
};

Keyboard.prototype.destroyModifications = function () {
	this.$modifications_holder.empty().hide();
};

Keyboard.prototype.upperRegister = function () {
	return ((this.active_shift && !this.active_caps) || (!this.active_shift && this.active_caps));
};

Keyboard.prototype.toggleShift = function (state) {
	this.active_shift = state ? state : !this.active_shift;
	this.changeKeysState();
};

Keyboard.prototype.resetShift = function() {
	this.active_shift = true;
}

Keyboard.prototype.unshift = function() {
	this.active_shift = false;
}

Keyboard.prototype.toggleCaps = function (state) {

	this.active_caps = state ? state : !this.active_caps;
	this.changeKeysState();
};

Keyboard.prototype.changeKeysState = function () {
	$.each(this.keys, function (_, key) {
		key.setCurrentValue();
		key.toggleActiveState();
	});
};

Keyboard.prototype.doTabLeft = function(tab_index) {
	$('.tabbable').eq(tab_index - 1).focus();
}

Keyboard.prototype.doTabRight = function(tab_index) {
	$('.tabbable').eq(tab_index + 1).focus();
}

