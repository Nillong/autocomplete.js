
Autocomplete = function() {
  this.initialize.apply(this, arguments);
};

Autocomplete.autocompleteId = 'autocomplete';
Autocomplete.selectClassName = 'select-item';
Autocomplete.key = {
			TAB:    9,
			ENTER:  13,
			UP:     38,
			DOWN:   40
};

Autocomplete.prototype = {
  initialize: function(input, autocompletelist, count) {
    this.inputElm = this._getElement(input);
    this.autocompletelist = autocompletelist;
    this.count = count;

    // reg event
    this._addEvent(this.inputElm, 'input', function(){
      if (this._getInputText().length === 0){
      	this._removeAutocompleteArea();
      } else {
      	this._setAutocomplete();
      }
    }.bind(this));
    this._addEvent(this.inputElm, 'blur', function(){
      this._removeAutocompleteArea();
    }.bind(this));
  },
  _getElement: function(element) {
    return (typeof element == 'string') ? document.getElementById(element) : element;
  },
  _getInputText: function() {
    return this.inputElm.value;
  },
   _addEvent: function(element, type, func) {
		if (element){
	  		element.addEventListener(type, func, false);
		}
	},
	_removeEvent: function(element, type, func) {
		if (element){
	  		element.removeEventListener(type, func);
		}
	},
	_createResultList: function(){
	  var text = this._getInputText();
	  var resultList = []
	  for (var i = 0; i < this.autocompletelist.length; i++) {
	    if (this.autocompletelist[i].indexOf(text) >= 0){
	      resultList.push(this.autocompletelist[i]);
	    }
      if (resultList.length >= this.count){
        break;
      }
    }
    return resultList;
	},
	 _removeAutocompleteArea: function(){
	    var autocompleteElm = document.getElementById(Autocomplete.autocompleteId);
	    if (autocompleteElm){
	    	autocompleteElm.parentElement.removeChild(autocompleteElm);
			  if (document.activeElement != this.inputElm){
			    this._removeEvent(this.inputElm, 'keydown', this._keydown);
			  }
	    }
	},
	_setAutocomplete: function () {
        var autocompleteElm = document.getElementById(Autocomplete.autocompleteId);
        if (autocompleteElm){
            while(autocompleteElm.firstChild){
                autocompleteElm.removeChild(autocompleteElm.firstChild);
            }
        } else {
        	autocompleteElm = this._createAutocompleteArea();
        }

        var resultList = this._createResultList();
        if (resultList === null || resultList.length === 0){
        	this._removeAutocompleteArea();
        }
        for (var i = 0; i < resultList.length; i++) {
            var element = document.createElement("div");
            element.innerHTML = resultList[i];
            autocompleteElm.appendChild(element);
        }
    },
    _createAutocompleteArea: function(){
        var suggestElm = document.createElement("div");
        suggestElm.id = Autocomplete.autocompleteId;
        
        suggestElm.style.width = this.inputElm.offsetWidth + 'px';
        suggestElm.style.left = this.inputElm.offsetLeft + 'px';
        
		this._addEvent(this.inputElm, 'keydown', this._keydown.bind(this));
		
        this.inputElm.parentNode.insertBefore(suggestElm, this.inputElm.nextSibling);
		return suggestElm;
    },
    _keydown : function(event){
		var suggestElm = document.getElementById(Autocomplete.autocompleteId);
		if (this._getInputText != '' && suggestElm && suggestElm.firstChild){
			switch (event.keyCode) {
			  case Autocomplete.key.DOWN:
				this._keyDonwAndUp(true, suggestElm, this.inputElm);
			    break;
			  case Autocomplete.key.UP:
				this._keyDonwAndUp(false, suggestElm, this.inputElm);
			    break;
			  case Autocomplete.key.ENTER:
				inputElm.onblur();
				break;
			}
		}
	},
	_keyDonwAndUp : function(isDown, suggestElm){
		var firstElement = isDown ? suggestElm.firstElementChild : suggestElm.lastElementChild;
		var lasElement = isDown ? suggestElm.lastElementChild : suggestElm.firstElementChild;
		var oldSelectedItem = this._getSelectedItem(); 
		var newSelectedItem = null; 
        if (oldSelectedItem == null){
        	newSelectedItem = firstElement;
        }else{
        	this._removeSelectedItemList();
        	if (oldSelectedItem == lasElement){
        		newSelectedItem = firstElement;
        	}else{
        		newSelectedItem = isDown ? oldSelectedItem.nextElementSibling : oldSelectedItem.previousElementSibling;
        	}
        }
        this._selectItem(newSelectedItem, true);
	},
	_getSelectedItem: function(){
		var list = this._getSelectedItemList();
		return list[0];
	},
	_getSelectedItemList: function(){
		var suggestElm = document.getElementById(Autocomplete.autocompleteId);
	    var selectedItems = document.getElementsByClassName(Autocomplete.selectClassName, suggestElm);
        if (selectedItems.length == 0){
        	return [];        	
        }
    	return selectedItems;
	},
	_removeSelectedItemList : function(){
		var list = this._getSelectedItemList();
		for (var i = 0;i < list.length; i++){
           	list[i].classList.remove(Autocomplete.selectClassName);
		}
	},
	_selectItem : function(newSelectedItemElm, fillText){
		newSelectedItemElm.classList.add(Autocomplete.selectClassName);
		if (fillText){
			this.inputElm.value = newSelectedItemElm.innerText;
		}
	}
}