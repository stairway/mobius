mobius.extend({
	device: (function() {
		var version = "0.7.0";
		
		return {
			version: version
		};
	})()
});

mobius.extend( mobius.device, {
	support: (function() {
		var config = {
				jqTest: false,
				cssTest: false
			},
			status = {
				gradeA: false,
				isJqSmart: false,
				isCssSmart: false
			};
		
		// PRIVATE
		function jqCapable() {
			var result = true;
			
			if(typeof config.jqTest !== 'undefined') {
				if( mobius.typeOf( config.jqTest ) === 'array' ) {
					var i;
					for( i in config.jqTest ) {
						if(config.jqTest && config.jqTest.length) {
							result = result && mobius.device.support.js(config.jqTest[i]) ? true : false;
						}
					}
					status.isJqSmart = result;
				} else {
					status.isJqSmart = mobius.device.support.js(config.jqTest);
				}
			} else {
				status.isJqSmart = false;
			}
		}
		
		function css3Capable() {
			var result = true;
				
			if(typeof config.cssTest !== 'undefined') {
				if( mobius.typeOf( config.cssTest ) === 'array' ) {
					var i;
					for( i in config.cssTest ) {
						if(config.cssTest && config.cssTest.length) {
							result = result && mobius.device.support.css(config.cssTest[i]) ? true : false;
						}
					}
					status.isCssSmart = result;
				} else {
					status.isCssSmart = mobius.device.support.css(config.cssTest);
				}
			} else {
				status.isCssSmart = false;
			}
		}
		
		function gradeA() {
			css3Capable();
			jqCapable();
			status.gradeA = status.isCssSmart & status.isJqSmart ? true : false; // bitwise AND (&) as opposed to logical AND (&&) - this ensures the tests return a boolean value
		}
		
		function init() {
			gradeA();
		}
		
		// PUBLIC
		function load(jqTest,cssTest) {
			config.jqTest = jqTest;
			config.cssTest = cssTest;
			this.status = status;
			return (document.onready = init());
		}
			
		var publicObj = {
			check: load,
			status: null
		};
			
		return publicObj;
	})(),
	
	orientation: (function(){
		function getWindowWidth() {
			if (window.innerWidth) {
				return window.innerWidth;
			} else if (document.documentElement.clientWidth) {
				return document.documentElement.clientWidth;
			} else if (document.body.clientWidth) {
				return document.body.clientWidth;
			} else{
				return 0;    
			}
		}
		function getWindowHeight() {
			if (window.innerHeight) {
				return window.innerHeight;
			} else if (document.documentElement.clientHeight) {
				return document.documentElement.clientHeight;
			} else if (document.body.clientHeight) {
				return document.body.clientHeight;
			} else {
				return 0;    
			}
		}
		var config = {
			loaded: false,
			orientation: getWindowWidth() < getWindowHeight() ? 'portrait' : 'landscape',
			width: getWindowWidth(),
			height: getWindowHeight(),
			tag: "body",
			attr: "orient",
			sizes: Array(320,480,768,1024)
		};
		var oldAttr;
		var newAttr;
		
		// PRIVATE
		// Adding events to elements in the DOM without overwriting it
		function addEvent(element, newFunction, eventType) {
			var oldEvent = eval("element." + eventType);
			var eventContentType = eval("typeof element." + eventType);
			
			if ( eventContentType !== 'function' ) {
				eval("element." + eventType + " = newFunction");
			} else {
				eval("element." + eventType + " = function(e) { oldEvent(e); newFunction(e); }");
			}
		}
		
		function getWidths() {
			var minW = "";
			var maxW = "";
			var sizes = config.sizes;
			var j = 0;
			var i;
			for( i in sizes) {
				if( sizes[i] <= config.width ) {
					minW = minW + "min-width-" + sizes[i].toString() + "px" + " ";
				} else {
					maxW = maxW + "max-width-" + sizes[i].toString() + "px" + " ";
					j++;
				}
			}
			
			minW = minW.replace(/\s+$/,"");
			maxW = maxW.replace(/\s+$/,"");
					
			if( minW === "" && config.width < sizes[0] ) {
				minW = "min-width-0";
			}
			
			var result = maxW.length ? minW + " " + maxW : minW;
			
			return result;
		}
		
		function addTagAttr(tag,attr,value) {
			newAttr = oldAttr !== null ? oldAttr + " " + value : value;
			
			var el = document.getElementsByTagName(tag)[0];
			
			if( attr.toLowerCase() === "class" ) {
				el.className = newAttr;
			} else {
				el.setAttribute(attr, newAttr);
			}
		}
		
		function updateOrientation() {
			config.width = getWindowWidth();
			config.height = getWindowHeight();
			config.orientation = config.width < config.height ? 'portrait' : 'landscape';
			
			addTagAttr(config.tag,config.attr, getWidths() + " " + config.orientation);
		}
		
		function init() {
			// if(arguments.callee.done) { return; }
			if(config.loaded === true) { return; }
			
			var el = document.getElementsByTagName(config.tag)[0];
			oldAttr = el.getAttribute(config.attr);
			
			updateOrientation();
			if ( window.orientation !== undefined ) {
				window.onorientationchange = updateOrientation;
			} else {
				addEvent(window, updateOrientation, 'onresize');
			}
			
			// arguments.callee.done = true;
			config.loaded = true;
		}
		
		function loader( delay ) {
			setTimeout( function() { init(); } , delay );
		}
		
		// PUBLIC
		function load(tag,attr,sizes,delay) {
			if( (typeof(sizes) === "object" || typeof(sizes) === "array") && sizes.length ) { config.sizes = sizes; }
			if(tag !== null) { config.tag = tag; }
			if(attr !== null) { config.attr = attr; }
			if(delay === undefined) { delay = 0; }
			return loader( delay );
		}
		
		function is(size){
			var rtn = false;
			var sizes = getWidths();
			var result = sizes.split(" ");
			mobius.each( result, function( i, name ) {
				if( size === name ){
					rtn = true;
				}
			});
			return rtn;
		}
		
		var publicObj = {
			load: load,
			is: is,
			orientation: config.orientation,
			width: getWindowWidth(),
			height: getWindowHeight()
		};
		
		return publicObj;
	})()
});

mobius.extend( mobius.device.support, {
	css: (function(){
		var div = document.createElement('div'),
			vendors = 'Khtml Ms O Moz Webkit'.split(' '),
			len = vendors.length;
	
		return function(prop) {
			if ( prop in div.style ) { return true; }
	
			prop = prop.replace(/^[a-z]/, function(val) {
				return val.toUpperCase();
			});
			
			var i = len;
			while(i--) {
				if ( vendors[i] + prop in div.style ) {
					// browser supports box-shadow. Do what you need.
					// Or use a bang (!) to test if the browser doesn't.
					return true;
				}
			}
			return false;
		};
	})(),
	
	js: (function(){
		return function( f ) {
			if( typeof f !== "string" ){ return false; }
			var check = null;
			switch( f.toLowerCase() ){
				case "jquery":
					result = typeof jQuery === 'function';
					break;
					
				default:
					result = false;
					break;
			}
			return result;
		};
	})()
});

mobius.extend( mobius.device, {
	mouseEvents: (function() {
		
		var elClass = "btn",
			elGroup = "btn_group",
			elExclude = "btn_exclude",
			elObj = {btnClass: elClass, btnGroup: elGroup, btnExclude: elExclude};
					
		return {
			init: function(obj) {
				obj = mobius.extend(elObj,obj);
				
				if( !!obj.btnGroup ) {
					var group = mobius.getElementsByClassName(obj.btnGroup);
					mobius.each(group,function(i,name) {
						var j=0;
						for(j;j<name.childNodes.length;j++){
							if(name.childNodes[j].nodeType == 1) {
								if( !!obj.btnExclude ){
									var regex = new RegExp(obj.btnExclude,"gi");
									if( !(name.childNodes[j].className.match(regex)) ) {
										mobius.addClass(name.childNodes[j],obj.btnClass);
									}
								}
							}
						}
					});
				}
				
				mobius.each( mobius.getElementsByClassName(obj.btnClass) ,function(i,name){
					mobius.device.mouseEvents.clearStates(name);
					new mobius.device.mouseEvents.handleClick(name);
					new mobius.device.mouseEvents.handleHover(name);
				});
			},
			states: {
				click: {
					active: "active",
					press: "pressed"
				},
				hover: {
					hover: "hover",
					over: "down",
					off: "up"
				},
				form: {
					focus: "focus",
					blur: "blur"
				}
			},
			getNode: function(node,el) {
				if( node.parentNode !== null && ( node.tagName.toLowerCase() !== el.toLowerCase() ) ){
					return this.getNode(node.parentNode,el);
				}
				return node;
			},
			clearStates: function(name) {
				function remove() {
					mobius.each( mobius.device.mouseEvents.states, function(type, stateObj) {
						mobius.each( stateObj, function(key, state) {
							mobius.removeClass(name,state);
						});
					});
				}
				if( typeof window.onunload !== undefined ) {
					window.onunload = function(e){
						remove();
					};
				} else {
					if( typeof window.onbeforeunload !== undefined ) {
						window.onbeforeunload = function(e) {
							remove();
						};
					}
				}
			}
		};
	})()
});

mobius.extend( mobius.device.mouseEvents, {
	handleClick: (function(){
		return function(element) {
			var that = this;
			this.element = element;
			this.tag = element.tagName;
			
			function helper(e) {
				that.handleEvent.apply( that, [e] );
			}
			
			if( this.element !== null ) {
				if( !window.Touch ) {
					var el = this.element;
					
					if (el.attachEvent) {
						el.attachEvent ("onclick",function(e){
							helper(e);
						});
					} else {
						el.addEventListener ("click",helper,false);
						
						//el.onclick = function(e) {
						//	helper(e);
						//};
					}
				} else {
					this.clickType = "touchstart";
					this.element.addEventListener(this.clickType, helper, false); 
				}
			}
			
			this.handleEvent = function(e) {
				e = mobius.Event.correctEvent(e);
				
				switch(e.type) {
					case 'touchstart': this.onTouchStart(e); break;
					case 'touchmove': this.onTouchMove(e); break;
					case 'touchend': this.onTouchEnd(e); break;
					case 'click': this.onClick(e); break;
				}
			};
			
			this.onClick = function(e) {
				var el = this.element;
				
				var anchor,
					target;
					
				if(this.touchAnchor) {
					anchor = this.touchAnchor;
				} else {
					if(document.elementFromPoint) {
						anchor = document.elementFromPoint(e.clientX, e.clientY);
					} else {
						anchor = el;
					}
				}
				
				this.theTarget = mobius.device.mouseEvents.getNode(anchor,this.tag);
				
				mobius.removeClass(this.theTarget,mobius.device.mouseEvents.states.hover.hover);
				mobius.addClass(this.theTarget,mobius.device.mouseEvents.states.click.active);
				
				if( el.detachEvent ) {
					el.detachEvent('onclick', this);
				} else {
					el.removeEventListener('click', this, false);
				}
			};
			
			this.onTouchStart = function(e) {
				var el = this.element;
				
				this.touchAnchor = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
				this.moved = false;
				this.theTarget = mobius.device.mouseEvents.getNode(this.touchAnchor,this.tag);
				
				if(this.theTarget.nodeType == 3) {
					this.theTarget = this.theTarget.parentNode;
				}
				
				mobius.removeClass(this.theTarget,mobius.device.mouseEvents.states.click.press);
				mobius.addClass(this.theTarget,mobius.device.mouseEvents.states.click.press);
		
				el.addEventListener('touchmove', this, false);
				el.addEventListener('touchend', this, false);
			};
		
			this.onTouchMove = function(e) {
				this.moved = true;
				mobius.removeClass(this.theTarget,mobius.device.mouseEvents.states.click.press);
			};
		
			this.onTouchEnd = function(e) {
				var el = this.element;
				
				el.addEventListener('click', this, false);
				el.removeEventListener('touchmove', this, false);
				el.removeEventListener('touchend', this, false);
				
				if( !this.moved && this.theTarget ) {
					mobius.removeClass(this.theTarget,mobius.device.mouseEvents.states.click.press);
					var theEvent = document.createEvent('MouseEvents');
					theEvent.initEvent('click', true, true);
					this.theTarget.dispatchEvent(theEvent);
				}
		
				this.theTarget = undefined;
			};
			
		};
	})()
});

mobius.extend( mobius.device.mouseEvents, {
	handleHover: (function(){
		return function(element) {
			var that = this;
			this.element = element;
			this.tag = element.tagName;
			
			function helper(e) {
				that.handleEvent.apply( that, [e] );
			}
						
			if( this.element !== null ) {
				if( !window.Touch ) {
					var that = this,
						el = this.element;
					
					if(el.attachEvent) {
						el.attachEvent("onmouseover",function(e){
							helper(e);
						});
					} else {
						el.addEventListener("mouseover",helper,false);
						
						//el.onmouseover = function(e) {
						//	helper(e);
						//};
					}
				}
			}
			
			/* ADD SUPPORT FOR IE mouseenter, mouseleave ??? */
						
			this.handleEvent = function(e) {
				e = mobius.Event.correctEvent(e);
				
				switch(e.type) {
					case 'mouseover': 
						this.onMouseOver(e); 
						break;
					case 'mouseout': 
						this.onMouseOut(e); 
						break;
				}
			};
			
			this.onMouseOver = function(e) {
				var el = this.element,
					anchor = document.elementFromPoint ? document.elementFromPoint(e.clientX, e.clientY) : el;
								
				this.theTarget = mobius.device.mouseEvents.getNode(anchor,this.tag);
				
				if(this.theTarget.nodeType == 3) {
					this.theTarget = this.theTarget.parentNode;
				}
				
				mobius.removeClass(this.theTarget,mobius.device.mouseEvents.states.hover.hover);
				mobius.addClass(this.theTarget,mobius.device.mouseEvents.states.hover.hover);
				
				if( el.attachEvent ) {
					el.attachEvent('onmouseout', function(e){
						helper(e);
					});
				} else {
					el.addEventListener('mouseout', helper, false);
					el.onmouseout = function(e) {
						helper(e);
					};
				}
			};
			
			this.onMouseOut = function(e) {
				if( this.theTarget ) {
					mobius.removeClass(this.theTarget,mobius.device.mouseEvents.states.hover.hover);
				}
				this.theTarget = undefined;
			};
		};
	})()
});