(function($){
  /**
	 * Focusses the next :focusable element. Elements with tabindex=-1 are focusable, but not tabable.
	 * Does not take into account that the taborder might be different as the :tabbable elements order
	 * (which happens when using tabindexes which are greater than 0).
	 */
	$.focusNext = function(){
		selectNextTabbableOrFocusable(':focusable');
	};

	/**
	 * Focusses the previous :focusable element. Elements with tabindex=-1 are focusable, but not tabable.
	 * Does not take into account that the taborder might be different as the :tabbable elements order
	 * (which happens when using tabindexes which are greater than 0).
	 */
	$.focusPrev = function(){
		selectPrevTabbableOrFocusable(':focusable');
	};

	/**
	 * Focusses the next :tabable element.
	 * Does not take into account that the taborder might be different as the :tabbable elements order
	 * (which happens when using tabindexes which are greater than 0).
	 */
	$.tabNext = function(){
		selectNextTabbableOrFocusable(':tabbable');
	};

	/**
	 * Focusses the previous :tabbable element
	 * Does not take into account that the taborder might be different as the :tabbable elements order
	 * (which happens when using tabindexes which are greater than 0).
	 */
	$.tabPrev = function(){
		selectPrevTabbableOrFocusable(':tabbable');
	};

	function selectNextTabbableOrFocusable(selector){
		var selectables = $(selector);
		var current = $(':focus');
		var nextIndex = 0;
		if(current.length === 1){
			var currentIndex = selectables.index(current);
			if(currentIndex + 1 < selectables.length){
				nextIndex = currentIndex + 1;
			}
		}

		selectables.eq(nextIndex).focus();
	}

	function selectPrevTabbableOrFocusable(selector){
		var selectables = $(selector);
		var current = $(':focus');
		var prevIndex = selectables.length - 1;
		if(current.length === 1){
			var currentIndex = selectables.index(current);
			if(currentIndex > 0){
				prevIndex = currentIndex - 1;
			}
		}

		selectables.eq(prevIndex).focus();
	}

	/**
	 * :focusable and :tabbable, both taken from jQuery UI Core
	 */
	$.extend($.expr[ ':' ], {
		data: $.expr.createPseudo ?
			$.expr.createPseudo(function(dataName){
				return function(elem){
					return !!$.data(elem, dataName);
				};
			}) :
			// support: jQuery <1.8
			function(elem, i, match){
				return !!$.data(elem, match[ 3 ]);
			},

		focusable: function(element){
			return focusable(element, !isNaN($.attr(element, 'tabindex')));
		},

		tabbable: function(element){
			var tabIndex = $.attr(element, 'tabindex'),
				isTabIndexNaN = isNaN(tabIndex);
			return ( isTabIndexNaN || tabIndex >= 0 ) && focusable(element, !isTabIndexNaN);
		}
	});

	/**
	 * focussable function, taken from jQuery UI Core
	 * @param element
	 * @returns {*}
	 */
	function focusable(element){
		var map, mapName, img,
			nodeName = element.nodeName.toLowerCase(),
			isTabIndexNotNaN = !isNaN($.attr(element, 'tabindex'));
		if('area' === nodeName){
			map = element.parentNode;
			mapName = map.name;
			if(!element.href || !mapName || map.nodeName.toLowerCase() !== 'map'){
				return false;
			}
			img = $('img[usemap=#' + mapName + ']')[0];
			return !!img && visible(img);
		}
		return ( /^(input|select|textarea|button|object)$/.test(nodeName) ?
			!element.disabled :
			'a' === nodeName ?
				element.href || isTabIndexNotNaN :
				isTabIndexNotNaN) &&
			// the element and all of its ancestors must be visible
			visible(element);

		function visible(element){
			return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function(){
				return $.css(this, 'visibility') === 'hidden';
			}).length;
		}
	}
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
  function KeyDelete() {
  Key.call(this, arguments);

  this.id = "mlkeyboard-backspace";
  this.default_value = 'delete';
}

KeyDelete.prototype = new Key();
KeyDelete.prototype.constructor = KeyDelete;

KeyDelete.prototype.defaultClickAction = function() {
  this.keyboard.deleteChar();
};
  function KeyTab() {
  Key.call(this, arguments);

  this.id = "mlkeyboard-tab";
  this.default_value = 'tab';
}

KeyTab.prototype = new Key();
KeyTab.prototype.constructor = KeyTab;

KeyTab.prototype.defaultClickAction = function() {
  this.keyboard.hideKeyboard();
  $(":input").eq($(":input").index(this.keyboard.$current_input)+1).focus();
};

  function KeyCapsLock() {
  Key.call(this, arguments);

  this.id = "mlkeyboard-capslock";
  this.default_value = 'caps lock';
}

KeyCapsLock.prototype = new Key();
KeyCapsLock.prototype.constructor = KeyCapsLock;

KeyCapsLock.prototype.isActive = function() {
  return this.keyboard.active_caps;
};

KeyCapsLock.prototype.defaultClickAction = function() {
  this.keyboard.toggleCaps();
};
  function KeyReturn() {
  Key.call(this, arguments);

  this.id = "mlkeyboard-return";
  this.default_value = 'return';
}

KeyReturn.prototype = new Key();
KeyReturn.prototype.constructor = KeyReturn;

KeyReturn.prototype.defaultClickAction = function() {
  var e = $.Event("keypress", {
    which: 13,
    keyCode: 13
  });
  this.keyboard.$current_input.trigger(e);
};
  function KeyShift() {
  Key.call(this, arguments);

  this.id = "mlkeyboard-"+arguments[1]+"-shift";
  this.default_value = 'shift';
}

KeyShift.prototype = new Key();
KeyShift.prototype.constructor = KeyShift;

KeyShift.prototype.isActive = function() {
  return this.keyboard.active_shift;
};

KeyShift.prototype.defaultClickAction = function() {
  this.keyboard.toggleShift();
};
  function KeyLeftArrow() {
    Key.call(this, arguments);
  
    this.id = "mlkeyboard-left-arrow";
    this.default_value = '←';
    this.no_char = true;
  }
  
  KeyLeftArrow.prototype = new Key();
  KeyLeftArrow.prototype.constructor = KeyLeftArrow;
  function KeyClear() {
    Key.call(this, arguments);
  
    this.id = "mlkeyboard-clear";
    this.default_value = '';
    this.no_char = true;
  }
  
  KeyClear.prototype = new Key();
  KeyClear.prototype.constructor = KeyClear;
  function KeySpace() {
  Key.call(this, arguments);

  this.id = "mlkeyboard-space";
  this.default_value = ' ';
}

KeySpace.prototype = new Key();
KeySpace.prototype.constructor = KeySpace;
  function KeyRightArrow() {
    Key.call(this, arguments);
  
    this.id = "mlkeyboard-right-arrow";
    this.default_value = '→';
    this.no_char = true;
  }
  
  KeyRightArrow.prototype = new Key();
  KeyRightArrow.prototype.constructor = KeyRightArrow;
  function KeyClose(){
    Key.call(this, arguments);

    this.id = "mlkeyboard-close";
    this.default_value = 'Close Keyboard';
}

KeyClose.prototype = new Key();
KeyClose.prototype.constructor = KeyClose;

KeyClose.prototype.defaultClickAction = function() {
    this.keyboard.hideKeyboard();
}
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

		
		console.log(key);
		console.dir(i + ' = ');

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


	if (this.options.show_on_focus) {
		$input.bind('focus', function () { 
			_this.showKeyboard($input); 
		});
	}

	if (this.options.hide_on_blur) {

		$input.bind('blur', function () {
			var VERIFY_STATE_DELAY = 500;
			
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

	if (this.options.trigger) {
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



  $.fn.mlKeyboard = function(options) {
    var keyboard = new Keyboard(this.selector, options);
    keyboard.init();

    this.each(function(){
      keyboard.setUpFor($(this));
    });
  };

})(jQuery);

var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.en_US = [
  {d: '`', u: '~'},
  {d: '1',u: '!', np: true},
  {d: '2',u: '@', np: true},
  {d: '3',u: '#', np: true},
  {d: '4',u: '$', np: true},
  {d: '5',u: '%', np: true},
  {d: '6',u: '^', np: true},
  {d: '7',u: '&', np: true},
  {d: '8',u: '*', np: true},
  {d: '9',u: '(', np: true},
  {d: '*', u:'*', np: true, hide:true},
  {d: '0',u: ')', np: true},
  {d: '#', u:'#', np: true, hide:true},
  {d: '-',u: '_'},
  {d: '=',u: '+'},
  {}, // Delete
  {}, // Tab
  {d: 'q',u: 'Q'},
  {d: 'w',u: 'W'},
  {d: 'e',u: 'E'},
  {d: 'r',u: 'R'},
  {d: 't',u: 'T'},
  {d: 'y',u: 'Y'},
  {d: 'u',u: 'U'},
  {d: 'i',u: 'I'},
  {d: 'o',u: 'O'},
  {d: 'p',u: 'P'},
  {d: ']',u: '}'},
  {d: '[',u: '{'},
  {d: '\\',u: '|'},
  {}, // Caps lock
  {d: 'a',u: 'A'},
  {d: 's',u: 'S'},
  {d: 'd',u: 'D'},
  {d: 'f',u: 'F'},
  {d: 'g',u: 'G'},
  {d: 'h',u: 'H'},
  {d: 'j',u: 'J'},
  {d: 'k',u: 'K'},
  {d: 'l',u: 'L'},
  {d: ';',u: ':'},
  {d: '\'',u: '"'},
  {}, // Return
  {}, // Left shift
  {d: 'z',u: 'Z'},
  {d: 'x',u: 'X'},
  {d: 'c',u: 'C'},
  {d: 'v',u: 'V'},
  {d: 'b',u: 'B'},
  {d: 'n',u: 'N'},
  {d: 'm',u: 'M'},
  {d: ',',u: '<'},
  {d: '.',u: '>'},
  {d: '/',u: '?'},
  {}, // Right shift
  {d: '@', u:'@', email:true},
  {}, // Space,
  {d: '.', u:'.', email:true},
  {}, // Clear
  {}, // Left Arrow
  {}, // Close
  {}, // Right Arrow
];

var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.ru_RU = [
  {d: 'ё',u: 'Ё'},
  {d: '1',u: '!'},
  {d: '2',u: '\''},
  {d: '3',u: '№'},
  {d: '4',u: '%'},
  {d: '5',u: ':'},
  {d: '6',u: ','},
  {d: '7',u: '.'},
  {d: '8',u: ';'},
  {d: '9',u: '('},
  {d: '0',u: ')'},
  {d: '-',u: '_'},
  {d: '=',u: '+'},
  {}, // Delete
  {}, // Tab
  {d: 'й',u: 'Й'},
  {d: 'ц',u: 'Ц'},
  {d: 'у',u: 'У'},
  {d: 'к',u: 'К'},
  {d: 'е',u: 'Е'},
  {d: 'н',u: 'Н'},
  {d: 'г',u: 'Г'},
  {d: 'ш',u: 'Ш'},
  {d: 'щ',u: 'Щ'},
  {d: 'з',u: 'З'},
  {d: 'х',u: 'Х'},
  {d: 'ъ',u: 'Ъ'},
  {d: '|',u: '\\'},
  {}, // Caps Lock
  {d: 'ф',u: 'Ф'},
  {d: 'ы',u: 'Ы'},
  {d: 'в',u: 'В'},
  {d: 'а',u: 'А'},
  {d: 'п',u: 'П'},
  {d: 'р',u: 'Р'},
  {d: 'о',u: 'О'},
  {d: 'л',u: 'Л'},
  {d: 'д',u: 'Д'},
  {d: 'ж',u: 'Ж'},
  {d: 'э',u: 'Э'},
  {}, // Return
  {}, // Left Shift
  {d: 'я',u: 'Я'},
  {d: 'ч',u: 'Ч'},
  {d: 'с',u: 'С'},
  {d: 'м',u: 'М'},
  {d: 'и',u: 'И'},
  {d: 'т',u: 'Т'},
  {d: 'ь',u: 'Ь'},
  {d: 'б',u: 'Б'},
  {d: 'ю',u: 'Ю'},
  {d: '.',u: ','},
  {}, // Right Shift
  {},  // Space,
  {} // Close
];

var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.es_ES = [
  {d: '<', u: '>'},
  {d: '1',u: '¡'},
  {d: '2',u: '!'},
  {d: '3',u: '#'},
  {d: '4',u: '$'},
  {d: '5',u: '%'},
  {d: '6',u: '/'},
  {d: '7',u: '&'},
  {d: '8',u: '*'},
  {d: '9',u: '('},
  {d: '0',u: ')'},
  {d: '-',u: '_'},
  {d: '=',u: '+'},
  {}, // Delete
  {}, // Tab
  {d: 'q',u: 'Q'},
  {d: 'w',u: 'W'},
  {d: 'e',u: 'E', m: [
    {d: 'e', u: 'E'},
    {d: 'é', u: 'É'}
  ]},
  {d: 'r',u: 'R'},
  {d: 't',u: 'T'},
  {d: 'y',u: 'Y'},
  {d: 'u',u: 'U', m: [
    {d: 'u', u: 'U'},
    {d: 'ú', u: 'Ú'},
    {d: 'ü', u: 'Ü'}
  ]},
  {d: 'i',u: 'I', m: [
    {d: 'i', u: 'I'},
    {d: 'í', u: 'Í'}
  ]},
  {d: 'o',u: 'O', m: [
    {d: 'o', u: 'O'},
    {d: 'ó', u: 'Ó'}
  ]},
  {d: 'p',u: 'P'},
  {d: '´',u: 'º'},
  {d: '`',u: '¨'},
  {d: '\'',u: '"'},
  {}, // Caps lock
  {d: 'a',u: 'A', m: [
    {d: 'a', u: 'A'},
    {d: 'á', u: 'Á'}
  ]},
  {d: 's',u: 'S'},
  {d: 'd',u: 'D'},
  {d: 'f',u: 'F'},
  {d: 'g',u: 'G'},
  {d: 'h',u: 'H'},
  {d: 'j',u: 'J'},
  {d: 'k',u: 'K'},
  {d: 'l',u: 'L'},
  {d: 'ñ',u: 'Ñ'},
  {d: ';',u: ':'},
  {}, // Return
  {}, // Left shift
  {d: 'z',u: 'Z'},
  {d: 'x',u: 'X'},
  {d: 'c',u: 'C'},
  {d: 'v',u: 'V'},
  {d: 'b',u: 'B'},
  {d: 'n',u: 'N'},
  {d: 'm',u: 'M'},
  {d: ',',u: '¿'},
  {d: '.',u: '?'},
  {d: 'ç',u: 'Ç'},
  {}, // Right shift
  {},  // Space,
  {} // Close
];

var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.pt_PT = [
  {d: '\/', u: '|'},
  {d: '1',u: '!'},
  {d: '2',u: '"'},
  {d: '3',u: '#'},
  {d: '4',u: '$'},
  {d: '5',u: '%'},
  {d: '6',u: '&'},
  {d: '7',u: '/'},
  {d: '8',u: '('},
  {d: '9',u: ')'},
  {d: '0',u: '='},
  {d: '-',u: '?'},
  {d: '~',u: '^'},
  {}, // Delete
  {}, // Tab
  {d: 'q',u: 'Q'},
  {d: 'w',u: 'W'},
  {d: 'e',u: 'E', m: [
    {d: 'e', u: 'E'},
    {d: 'é', u: 'É'},
    {d: 'ê', u: 'Ê'}
  ]},
  {d: 'r',u: 'R'},
  {d: 't',u: 'T'},
  {d: 'y',u: 'Y'},
  {d: 'u',u: 'U', m: [
    {d: 'u', u: 'U'},
    {d: 'ú', u: 'Ú'}
  ]},
  {d: 'i',u: 'I', m: [
    {d: 'i', u: 'I'},
    {d: 'í', u: 'Í'}
  ]},
  {d: 'o',u: 'O', m: [
    {d: 'o', u: 'O'},
    {d: 'ó', u: 'Ó'},
    {d: 'õ', u: 'Õ'},
    {d: 'ô', u: 'Ô'}
  ]},
  {d: 'p',u: 'P'},
  {d: '´',u: 'º'},
  {d: '`',u: '¨'},
  {d: '\'',u: '"'},
  {}, // Caps lock
  {d: 'a',u: 'A', m: [
    {d: 'a', u: 'A'},
    {d: 'á', u: 'Á'},
    {d: 'à', u: 'À'},
    {d: 'ã', u: 'Ã'},
    {d: 'â', u: 'Â'}
  ]},
  {d: 's',u: 'S'},
  {d: 'd',u: 'D'},
  {d: 'f',u: 'F'},
  {d: 'g',u: 'G'},
  {d: 'h',u: 'H'},
  {d: 'j',u: 'J'},
  {d: 'k',u: 'K'},
  {d: 'l',u: 'L'},
  {d: 'ñ',u: 'Ñ'},
  {d: ';',u: ':'},
  {}, // Return
  {}, // Left shift
  {d: 'z',u: 'Z'},
  {d: 'x',u: 'X'},
  {d: 'c',u: 'C', m: [
    {d: 'c', u: 'C'},
    {d: 'ç', u: 'Ç'}
  ]},
  {d: 'v',u: 'V'},
  {d: 'b',u: 'B'},
  {d: 'n',u: 'N'},
  {d: 'm',u: 'M'},
  {d: ',',u: '¿'},
  {d: '.',u: '?'},
  {d: 'ç',u: 'Ç'},
  {}, // Right shift
  {},  // Space,
  {} // Close
];

var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.it_IT = [
  {d: '\\', u: '|'},
  {d: '1',u: '!'},
  {d: '2',u: '"'},
  {d: '3',u: '£'},
  {d: '4',u: '$'},
  {d: '5',u: '%'},
  {d: '6',u: '&'},
  {d: '7',u: '/'},
  {d: '8',u: '('},
  {d: '9',u: ')'},
  {d: '0',u: '='},
  {d: '\'',u: '?'},
  {d: 'ì',u: '^'},
  {}, // Delete
  {}, // Tab
  {d: 'q',u: 'Q'},
  {d: 'w',u: 'W'},
  {d: 'e',u: 'E'},
  {d: 'r',u: 'R'},
  {d: 't',u: 'T'},
  {d: 'y',u: 'Y'},
  {d: 'u',u: 'U'},
  {d: 'i',u: 'I'},
  {d: 'o',u: 'O'},
  {d: 'p',u: 'P'},
  {d: 'e',u: 'é', m: [
    {d: 'e', u: 'é'},
    {d: '[', u: '{'}
  ]},
  {d: '+',u: '*', m: [
    {d: '+', u:'*'},
    {d: ']', u: '}'}
  ]},
  {}, // Caps lock
  {d: 'a',u: 'A'},
  {d: 's',u: 'S'},
  {d: 'd',u: 'D'},
  {d: 'f',u: 'F'},
  {d: 'g',u: 'G'},
  {d: 'h',u: 'H'},
  {d: 'j',u: 'J'},
  {d: 'k',u: 'K'},
  {d: 'l',u: 'L'},
  {d: 'ò',u: 'ç', m:[
    {d: 'ò',u: 'ç'},
    {d:'@', u: 'Ç'}
  ]},
  {d: 'à',u: '°', m:[
    {d: 'à',u: '°'},
    {d:'#', u: '∞'}
  ]},
  {d: 'ù',u: '§'},
  {}, // Return
  {}, // Left shift
  {d: '<', u:'>'},
  {d: 'z',u: 'Z'},
  {d: 'x',u: 'X'},
  {d: 'c',u: 'C'},
  {d: 'v',u: 'V'},
  {d: 'b',u: 'B'},
  {d: 'n',u: 'N'},
  {d: 'm',u: 'M'},
  {d: ',',u: ';'},
  {d: '.',u: ':'},
  {d: '-',u: '_'},
  {}, // Right shift
  {},  // Space,
  {} // Close
];

var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.fr_FR = [
  {d: '\/', u: '|'},
  {d: '1',u: '&'},
  {d: '2',u: 'é', m:[
    {d: '2', u:'é'},
    {d:'~', u:'É'}
  ]},
  {d: '3',u: '#', m: [
    {d:'3', u:'#'},
    {d:'"', u: '#'}
  ]},
  {d: '4',u: '{', m:[
    {d: '4', u:'{'},
    {d: '\'', u:'{'}
  ]},
  {d: '5',u: '(', m:[
    {d: '5', u:'('},
    {d: '[', u:'('}
  ]},
  {d: '6',u: '-', m:[
    {d: '6', u:'-'},
    {d: '|', u:'-'}
  ]},
  {d: '7',u: 'è', m:[
    {d: '7', u:'è'},
    {d: '`', u:'è'}
  ]},
  {d: '8',u: '_', m:[
    {d: '8', u:'_'},
    {d: '\/', u:'_'}
  ]},
  {d: '9',u: '', m:[
    {d: '9', u:'ç'},
    {d: '^', u:'Ç'}
  ]},
  {d: '0',u: 'à', m:[
    {d: '0', u:'à'},
    {d: '@', u:'À'}
  ]},
  {d: '°',u: ')', m:[
    {d: '°', u:')'},
    {d: ']', u:')'}
  ]},
  {d: '+',u: '=', m:[
    {d: '+', u:'='},
    {d: '}', u:'='}
  ]},
  {}, // Delete
  {}, // Tab
  {d: 'q',u: 'Q'},
  {d: 'w',u: 'W'},
  {d: 'e',u: 'E', m: [
    {d: 'e', u: 'E'},
    {d: 'é', u: 'É'},
    {d: 'ê', u: 'Ê'}
  ]},
  {d: 'r',u: 'R'},
  {d: 't',u: 'T'},
  {d: 'y',u: 'Y'},
  {d: 'u',u: 'U', m: [
    {d: 'u', u: 'U'},
    {d: 'ú', u: 'Ú'},
    {d: 'ü', u: 'Ü'}
  ]},
  {d: 'i',u: 'I', m: [
    {d: 'i', u: 'I'},
    {d: 'í', u: 'Í'}
  ]},
  {d: 'o',u: 'O', m: [
    {d: 'o', u: 'O'},
    {d: 'ó', u: 'Ó'},
    {d: 'õ', u: 'Õ'},
    {d: 'ô', u: 'Ô'}
  ]},
  {d: 'p',u: 'P'},
  {d: '^',u: 'º'},
  {d: '`',u: '¨'},
  {d: '\'',u: '"'},
  {}, // Caps lock
  {d: 'a',u: 'A', m: [
    {d: 'a', u: 'A'},
    {d: 'á', u: 'Á'},
    {d: 'à', u: 'À'},
    {d: 'ã', u: 'Ã'},
    {d: 'â', u: 'Â'}
  ]},
  {d: 's',u: 'S'},
  {d: 'd',u: 'D'},
  {d: 'f',u: 'F'},
  {d: 'g',u: 'G'},
  {d: 'h',u: 'H'},
  {d: 'j',u: 'J'},
  {d: 'k',u: 'K'},
  {d: 'l',u: 'L'},
  {d: 'ñ',u: 'Ñ'},
  {d: ';',u: ':'},
  {}, // Return
  {}, // Left shift
  {d: 'z',u: 'Z'},
  {d: 'x',u: 'X'},
  {d: 'c',u: 'C', m: [
    {d: 'c', u: 'C'},
    {d: 'ç', u: 'Ç'}
  ]},
  {d: 'v',u: 'V'},
  {d: 'b',u: 'B'},
  {d: 'n',u: 'N'},
  {d: 'm',u: 'M'},
  {d: ',',u: '¿'},
  {d: '.',u: '?'},
  {d: 'ç',u: 'Ç'},
  {}, // Right shift
  {},  // Space,
  {} // Close
];

var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.num_pad = [
    {d: '1',u: '!'},
    {d: '2',u: '@'},
    {d: '3',u: '#'},
    {d: '4',u: '$'},
    {d: '5',u: '%'},
    {d: '6',u: '^'},
    {d: '7',u: '&'},
    {d: '8',u: '*'},
    {d: '9',u: '('},
    {d: '*',u: ''},
    {d: '0',u: ')'},
    {d: '#',u: ''}
];
