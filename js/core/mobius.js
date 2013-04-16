(function( window ){
	var document = window.document,
		mobius = (function(){
			var mobius = function() {
					return new mobius.fn.init( rootmobius );
				},
				_mobius = window.mobius,
				rootmobius,
				
				// Save a reference to some core methods
				toString = Object.prototype.toString,
				hasOwn = Object.prototype.hasOwnProperty,
				push = Array.prototype.push,
				slice = Array.prototype.slice,
				trim = String.prototype.trim = function() {
					return this.replace(/^\s+|\s+$/g,""); /* this is not really necessary, but for good measure */
				},
				indexOf = Array.prototype.indexOf,
				bind = (!('bind' in Function.prototype) ?
					Function.prototype.bind = function(owner) {
						var that= this;
						var args= Array.prototype.slice.call(arguments, 1);
						return function() {
							return that.apply(owner,
								args.length===0? arguments : arguments.length===0? args :
								args.concat(Array.prototype.slice.call(arguments, 0))
							);
						};
					} : null),
			
				// [[Class]] -> type pairs
				class2type = {};
				
			mobius.version = "0.9.0";
			
			mobius.fn = mobius.prototype = {
				constructor: mobius,
				
				init: function( rootmobius ) {
					return this;
				}
			};
			
			mobius.fn.init.prototype = mobius.fn;
			
			mobius.extend = mobius.fn.extend = function() {
				var options, name, src, copy, copyIsArray, clone,
					target = arguments[0] || {},
					i = 1,
					length = arguments.length,
					deep = false;
			
				// Handle a deep copy situation
				if ( typeof target === "boolean" ) {
					deep = target;
					target = arguments[1] || {};
					// skip the boolean and the target
					i = 2;
				}
			
				// Handle case when target is a string or something (possible in deep copy)
				if ( typeof target !== "object" && !mobius.isFunction(target) ) {
					target = {};
				}
			
				// extend mobius itself if only one argument is passed
				if ( length === i ) {
					target = this;
					--i;
				}
			
				for ( ; i < length; i++ ) {
					// Only deal with non-null/undefined values
					if ( (options = arguments[ i ]) !== null ) {
						// Extend the base object
						for ( name in options ) {
							src = target[ name ];
							copy = options[ name ];
			
							// Prevent never-ending loop
							if ( target === copy ) {
								continue;
							}
			
							// Recurse if we're merging plain objects or arrays
							if ( deep && copy && ( mobius.isPlainObject(copy) || (copyIsArray = mobius.isArray(copy)) ) ) {
								if ( copyIsArray ) {
									copyIsArray = false;
									clone = src && mobius.isArray(src) ? src : [];
			
								} else {
									clone = src && mobius.isPlainObject(src) ? src : {};
								}
			
								// Never move original objects, clone them
								target[ name ] = mobius.extend( deep, clone, copy );
			
							// Don't bring in undefined values
							} else if ( copy !== undefined ) {
								target[ name ] = copy;
							}
						}
					}
				}
			
				// Return the modified object
				return target;
			};
			
			mobius.extend({
				noConflict: function( deep ) {		
					if ( deep ) {
						window.mobius = _mobius;
					}
			
					return mobius;
				},
						
				error: function( msg ) {
					throw msg;
				},
				
				isFunction: function( obj ) {
					return mobius.type(obj) === "function";
				},
			
				type: function( obj ) {
					return obj == null ?
						String( obj ) :
						class2type[ toString.call(obj) ] || "object";
				},
			
				inArray: function( elem, array ) {
					if ( array.indexOf ) {
						return array.indexOf( elem );
					}
			
					for ( var i = 0, length = array.length; i < length; i++ ) {
						if ( array[ i ] === elem ) {
							return i;
						}
					}
			
					return -1;
				},
				
				typeOf: function(value) {
					var s = typeof value;
					if (s === 'object') {
						if (value) {
							if (value instanceof Array) {
								s = 'array';
							}
						} else {
							s = 'null';
						}
					}
					return s;
				},
				
				utilities: {},
				
				// args is for internal usage only
				each: function( object, callback, args ) {
					var name, i = 0,
						length = object.length,
						isObj = length === undefined || mobius.isFunction(object);
			
					if ( args ) {
						if ( isObj ) {
							for ( name in object ) {
								if ( callback.apply( object[ name ], args ) === false ) {
									break;
								}
							}
						} else {
							for ( ; i < length; ) {
								if ( callback.apply( object[ i++ ], args ) === false ) {
									break;
								}
							}
						}
			
					// A special, fast, case for the most common use of each
					} else {
						if ( isObj ) {
							for ( name in object ) {
								if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
									break;
								}
							}
						} else {
							for ( var value = object[0];
								i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
						}
					}
			
					return object;
				},
			
				browser: {},
				
				print_r: function(G,F,I,C){
					C=C||0;
					F=F||10;
					I=I||" ";
					if(C>F){
						return"[WARNING: Too much recursion]\n";
					}
					var D,
						A="",
						H=typeof G,
						B="";
					if(G===null){
						A+="(null)\n";
					}else{
						if(H=="object"){
							C++;
							for(D=0;D<C;D++){
								B+=I;
							}
							if(G&&G.length){
								H="array";
							}
							A+="("+H+") :\n";
							for(D in G){
								try{
									A+=B+"["+D+"] : "+mobius.print_r(G[D],F,I,(C+1));
								}catch(E){
									return"[ERROR: "+E+"]\n";
								}
							}
						}else{
							if(H=="string"){
								if(G==""){
									G="(empty)";
								}
							}
							A+="("+H+") "+G+"\n";
						}
					}
					return A;
				},
				
				pad: function(number, length) { 
					var str = '' + number; 
					while (str.length < length) { 
						str = '0' + str; 
					} 
					return str; 
				},
				
				isNumeric: function(n) { 
					return !isNaN(parseFloat(n)) && isFinite(n); 
				},
				
				log: function( data, dump ){
					if( window.console && typeof( window.console.log ) === 'function' ) {
						dump === true ? console.log( mobius.print_r(data) ) : console.log( data );
					}
				},
				
				// global config
				global: {
					singleTimeout: true
				}
	
			});
			
			// Populate the class2type map
			/* DOESN'T WORK! - TODO: FIGURE OUT WHY */
			/*jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
				class2type[ "[object " + name + "]" ] = name.toLowerCase();
			});*/
			
			rootmobius = mobius(document);
			
			// Expose mobius to the global object
			return (window.mobius = mobius);
		})(),
		
		checkConsole = (function(fn) {
			if( window.console ) {
				if( !(fn in console) ) {
					return false;
				}
				return true;
			}
			return false;
		}),
		
		// callback queue
		callQueue = [];
	
	mobius.ready = (function(callback,options){
		
		this.config = {
			context: callback,
			timeout: 10000,
			loadDelay: 300
		};		
		mobius.extend( this.config, options );
		this.config.timeout = parseInt(this.config.timeout);
		
		callQueue.push( {callback: callback, context: this.config.context} );
		
		var that = this;
		
		this.abort = (function() {
			callQueue.shift();
			var msg = "mobius.ready() timed out";
			if( checkConsole("error") ) {
				console.error( msg );
			} else {
				alert( msg );
			}
			return false;
		});
		
		this.done = (function() {
			if( !(mobius.isready.status.abort && mobius.global.singleTimeout) ) {
				var func = callQueue.shift();
				func.callback.call(func.context);
			}
		});
		
		this.handle = (function(action) {
			switch(action) {
				case 1:
				case "ready":
					mobius.done.call(this);
					break;
				case 2:
				case "wait":
					this.wait();
					break;
				case 3:
				case "error":
					this.error();
					break;
				case 4:
				case "abort":
				default:
					mobius.abort.call(this);
					break;
			}
		});
		
		this.isready = (function(){
			return {
				called: false,
				status: {
					ready: false,
					abort: false,
					wait: false,
					error: {
						iserror: false,
						count: 0
					}
				},
				init: function() {
					//document.onready = mobius.go();
					
					window.onload = function(e) { mobius.go(that.config); }
					
					this.check();
				},
				check: function() {
					var action;					
					if(this.status.error.iserror) {
						action = "error";
					} else if(this.status.ready) {
						action = "ready";
					} else {
						action = "wait";
					}
					mobius.handle.apply(this,[action]);
				},
				error: function() {
					var action = "abort";
					if( mobius.global.singleTimeout ) {
						if( this.status.error.iserror && (++this.status.error.count === 1) ) {
							this.status.abort = true;
							mobius.handle.apply(this,[action]);
						}
					} else {
						this.status.abort = true;
						mobius.handle.apply(this,[action]);
					}
				},
				wait: function() {
					this.onwait = (function() {
						return {
							INT: 300,
							DONE: false,
							start: function() {
								var that = this,
									timeoutId = setTimeout( function() {
										that.DONE = true;
									}, mobius.config.timeout ),
									intervalId = setInterval( function() {
									if( !that.DONE ) {
										that.waiting(intervalId,timeoutId);
									} else {
										that.stop(intervalId,timeoutId,true);
									}
								}, that.INT );								
							},
							waiting: function(intervalId,timeoutId) {
								mobius.isready.status.waiting = true;
								if( mobius.isready.status.ready ) {
									this.stop(intervalId,timeoutId);
								}
							},
							stop: function(intervalId,timeoutId,timeout) {
								clearInterval(intervalId);
								clearTimeout(timeoutId);
								mobius.isready.status.waiting = false;
								mobius.isready.status.error.iserror = timeout;
								mobius.isready.check();
							}
						};
					})();
					
					this.onwait.start();
				}
			};
		})();
		
		this.isready.init();
	});
	
	mobius.extend( mobius.utilities, {
		executeFunctionByName: function(functionName, context /*, args */) {
			if( context === undefined ) { context = window; }
			var args = Array.prototype.slice.call(arguments).splice(2);
			var namespaces = functionName.split(".");
			var func = namespaces.pop();
			var i;
			for(i = 0; i < namespaces.length; i++) {
				context = context[namespaces[i]];
			}
			return context[func].apply(this, args);
		},
		
		loader: (function(){
			function loadJs(filename, callback) {
				var fileref;
				fileref=document.createElement('script');        
				fileref.setAttribute("type","text/javascript");
				fileref.setAttribute("src", filename);
				
				if(typeof callback !== 'undefined') {
					/* for ie */
					fileref.onreadystatechange = function () {
						if (this.readyState === 'complete' || this.readyState === 'loaded') {
							mobius.utilities.executeFunctionByName(callback);
						}
					};
					fileref.onload = mobius.utilities.executeFunctionByName(callback);
				}
				if (typeof fileref !== undefined) {
					document.getElementsByTagName("head")[0].appendChild(fileref);
				}
			}
			function loadCss(filename, callback) {
				var fileref;
				fileref=document.createElement("link");
				fileref.setAttribute("rel", "stylesheet");
				fileref.setAttribute("type", "text/css");
				fileref.setAttribute("href", filename);
				
				if(typeof callback !== 'undefined') {
					/* for ie */
					fileref.onreadystatechange = function () {
						if (this.readyState === 'complete' || this.readyState === 'loaded') {
							mobius.utilities.executeFunctionByName(callback);
						}
					};
					/* causes the script to break in ie (mobius.fn.mobile.support.status.cssLoaded is being set in mobius.fn.mobile.support) */
					//fileref.onload = mobius.utilities.executeFunctionByName(callback);
				}
				if (typeof fileref !== undefined) {
					document.getElementsByTagName("head")[0].appendChild(fileref);
				}
			}
			return {
				js: loadJs,
				css: loadCss
			};
		})()
	});
		
	mobius.fn.extend({
		hasClass: (function(obj, className) {
			if (typeof obj == 'undefined' || obj==null || !RegExp) { return false; }
			var re = new RegExp("(^|\\s)" + className + "(\\s|$)");
			if (typeof(obj)==="string") {
				return re.test(obj);
			}
			else if (typeof(obj)==="object" && obj.className) {
				return re.test(obj.className);
			}
			return false;
		}),
		getElementsByClassName: (function(searchClass,node,tag) {
			var classElements = new Array();
			if( typeof node === 'undefined' || node == null ) {
				node = document;
			} else if(typeof node === 'string') {
				node = document.getElementById(node);
			} else {
				if( typeof node !== 'object' ) {
					node = document;
				}
			}
			if ( tag == null ) tag = '*';
			var els = node.getElementsByTagName(tag),
				elsLen = els.length,
				pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"),
				i = 0,
				j = 0;
			for (i, j; i < elsLen; i++) {
				if ( pattern.test(els[i].className) ) {
					classElements[j] = els[i];
					j++;
				}
			}
			return classElements;
		}),
		addClass: function(el,className) {
			mobius.fn.removeClass(el,className);
			el.className = (el.className + " " + className).trim();
		},
		removeClass: function(el,className) {
			if( el.className !== undefined ){
				el.className = el.className.replace(className,"").trim();
			}
		},
		getParent: function(el) {
			if( el.nodeType == 1 && el.parentNode !== null ) {
				return el.parentNode;
			} else {
				return null;
			}
		},
		getChildren: function(el) {
			if( el.nodeType == 1 && el.childNodes !== null ) {
				var i,
					arr = [];
				for( i = 0; i < el.childNodes.length; i++ ) {
					if( el.childNodes[i].nodeType == 1 ) {
						arr.push(el.childNodes[i]);
					}
				}
				return arr;
			} else {
				return null;
			}
		},
		getSiblings: function(el) {				
			if( el && el.parentNode && el.nodeType == 1 ) {
				var i,
					arr = [];
				for( i = 0; i < el.parentNode.childNodes.length; i++ ) {
					if( el.parentNode.childNodes[i].nodeType == 1 ) {
						arr.push(el.parentNode.childNodes[i]);
					}
				}
				return arr;
			} else {
				return null;
			}
		},
		getNext: function(el) {
			if( el.nodeType == 1 && el.nextSibling !== null ) {
				return (el.nextSibling.nodeType == 1 ? el.nextSibling : el.nextSibling.nextSibling);
			} else {
				return null;
			}
		},
		getPrevious: function(el) {
			if( el.nodeType == 1 && el.previousSibling !== null ) {
				return (el.previousSibling.nodeType == 1 ? el.previousSibling : el.previousSibling.previousSibling);
			} else {
				return null;	
			}
		},
		getFirst: function(el) {
			if( el.nodeType == 1 && el.childNodes !== null ) {
				return (el.firstChild.nodeType == 1 ? el.firstChild : el.firstChild.nextSibling);
			} else {
				return null;
			}
		},
		getLast: function(el) {
			if( el.nodeType == 1 && el.childNodes !== null ) {
				return (el.lastChild.nodeType == 1 ? el.lastChild : el.lastChild.previousSibling);
			} else {
				return null;
			}
		},
		firstAndLast: (function(options){	
			options = typeof options === "object" ? options : {};
			var config = {
				tags: ["li"]
			};
			mobius.extend( config, options );
			
			this.getRelativeFirstLast = function(tag,children){
				children = children && mobius.getChildren(children) ? mobius.getChildren(children) : mobius.getChildren(document.getElementsByTagName("body")[0]);
		
				if( document.getElementsByTagName(tag).length ) {
					if( children.length && mobius.getSiblings(children[0]).length > 1 ) {
						var i,
							count = 0;
							
						for(i in children) {
							var currChild = children[i],
								nextChild = mobius.getNext(currChild),
								prevChild = mobius.getPrevious(currChild);
							
							if( (nextChild) && currChild.nodeName.toUpperCase() === nextChild.nodeName.toUpperCase() ) {
								if(++count === 1 && tag.toUpperCase() === currChild.nodeName.toUpperCase()) {
									mobius.addClass( currChild, "first" );
								}
							} else if( (prevChild) && currChild.nodeName.toUpperCase() === prevChild.nodeName.toUpperCase() ) {
								count = 0;
								if(count === 0 && tag.toUpperCase() === currChild.nodeName.toUpperCase()) {
									mobius.addClass( currChild, "last" );
								}
							}
							
							if( mobius.getChildren(currChild).length ) {
								this.getRelativeFirstLast(tag,currChild);
							}
						}						
					} else if( children.length && mobius.getSiblings(children[0]).length <= 1 ) {
						this.getRelativeFirstLast(tag,children[0]);
					} else {
						return false;
					}
				}
								
				return false;
			};
			
			for( key in config ) {
				if( key === "tags" ) {
					var prop = config[key];
					if( mobius.typeOf(config[key]) === "array" ) {
						var p,
							arr = [];
						for( p in prop ){
							this.getRelativeFirstLast(prop[p]);
						}
					}
				}
			}
		}),
		Event: (function(){
			return {
				add: function(obj,type,fn,context) {
					var that = this;
										
					if (obj.attachEvent) {
						obj['e'+type+fn] = fn;
						obj[type+fn] = function() { obj['e'+type+fn](window.event,that); }
						obj.attachEvent('on'+type,obj[type+fn]);
					} else {
						obj.addEventListener(type,function(e){
							fn.apply(context, [e,that] );
						},false);
						
						obj['on'+type] = function(e) {
							fn.apply( context, [e,that] );
						};
					}
				},
				remove: function(obj,type,fn) {
					var that = this;
					
					if (obj.detachEvent) {
						obj.detachEvent('on'+type,obj[type+fn]);
						obj[type+fn] = null;
					} else {
						obj.removeEventListener(type,fn,false);
					}
				},
				correctEvent: function(e) {
					return e || window.event;
				},
				preventDefault: function(event) {
					var e = this.correctEvent(event);
					if(e.preventDefault) {
						e.preventDefault();
					} else {
						e.returnValue = false;
					}
					return e;
				}
			};
		})(),
		ajax: (function(options,callerObj){ // callerObj is for internal use only
			var self = mobius.ajax.prototype;
			
			self.config = {
				type: "load", // load, get, post
				url: window.location.href,
				data: {},
				dataType: "html",
				success: function() { return false; },
				error: function() { return false; }
			};
			mobius.extend(self.config,options);
			self.config.type = self.config.type === "load" || self.config.type === "post" ? "post" : "get";
			
			self.XMLHttpFactories = [
				function () {return new XMLHttpRequest()},
				function () {return new ActiveXObject("Msxml2.XMLHTTP")},
				function () {return new ActiveXObject("Msxml3.XMLHTTP")},
				function () {return new ActiveXObject("Microsoft.XMLHTTP")}
			];
			
			self.createXMLHTTPObject = function() {
				var xmlhttp = null;
				for (var i=0;i<self.XMLHttpFactories.length;i++) {
					try {
						xmlhttp = self.XMLHttpFactories[i]();
					}
					catch (e) {
						continue;
					}
					break;
				}
				return xmlhttp;
			};
			
			self.objectToURL = function (url,query_str_obj,type) {
				var i = 0,
					url_str,
					property;
					
				if( type === "post" ) {
					url_str = url.search.substr(1);
				} else {
					url_str = (encodeURI ? encodeURI(url.pathname) : escape(url.pathname)) + "?" + url.search.substr(1);
				}
				
				if( encodeURIComponent ) {
					for(property in query_str_obj) {
						if( parseInt(url_str.length) && !i ) {
							url_str += "&";
						} else if( !parseInt(url_str.length) && !i ) {
							url_str += "";
						}
						url_str += property + "=" + encodeURIComponent( query_str_obj[property] ) + "&";
						i++;
					}
				} else {
					for(property in query_str_obj) {
						if( parseInt(url_str.length) && !i ) {
							url_str += "&";
						} else if( !parseInt(url_str.length) && !i ) {
							url_str += "";
						}
						url_str += property + "=" + encodeURIComponent( query_str_obj[property] ) + "&";
						i++;
					}
				}
				
				if( url_str.substr(url_str.length-1) === '?' || url_str.substr(url_str.length-1) === '&' ) {
					url_str = url_str.substr(0,url_str.length-1);
				}
								
				return url_str;
			};
			
			self.execute = function(obj) {
				var request = {
					url: self.config.url,
					type: self.config.type,
					data: self.config.data,
					dataType: self.config.dataType,
					success: self.config.success,
					error: self.config.error
				};
				mobius.extend(request,obj);
				
				var url = document.createElement('a');
				url.href = request.url;
				
				request.ajaxRequest = self.createXMLHTTPObject();
				request.sendRequest = function() {
					if(request.ajaxRequest.readyState == 1) {   //never happen, cause we create a new request each time
						alert('error: still processing previous request');
						return;
					}
					var escapedurl = self.objectToURL(url, request.data, request.type);
					if(request.type === "post") {
						request.ajaxRequest.open("post", url.pathname);
						request.ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
						request.ajaxRequest.send(escapedurl);
					} else {
						request.ajaxRequest.open("get", escapedurl);
						request.ajaxRequest.send(null);
					}
					request.ajaxRequest.onreadystatechange = function() {
						if(request.ajaxRequest.readyState == 4) {
							var err;
							if( request.ajaxRequest.status == 200 ) {
								var contentType = request.ajaxRequest.getResponseHeader("Content-Type");
								if( request.dataType === "json" ) {
									var jsondata = eval("("+request.ajaxRequest.responseText+")");
									request.success( jsondata );
								} else if( request.dataType === "xml" ) {
									request.success(request.ajaxRequest.responseXML);
								} else if( request.dataType === "html" ) {
									request.success(request.ajaxRequest.responseText);
								}
							} else {
								err = "Error: status " + request.ajaxRequest.status;
								request.error( "Error: status " + request.ajaxRequest.status );
							}
						}
					}
				}
				request.sendRequest();
				return request;
			};
			
			self.pageLoad = (function(){
				return {
					ajaxRequest: false,
					callerObj: parent,
					init: function(parent) {
						var ajax_links = document.getElementsByTagName('a'),
							that = this;
							
						this.ajaxRequest = false;
						
						this.callerObj = parent;
						
						parent.domListenersAndManipulation();
						
						mobius.each(ajax_links,function(i,name){
							mobius.Event.add(name,"click",function(e) {
								that.onClick(e,name,arguments[1]);
							},that);
						});
					},
					update: function(url, id) {
						var request,
							escapedurl = self.objectToURL(url, null, 'get'),
							that = this;
												
						if(request = self.createXMLHTTPObject()) {
							request.open('get', escapedurl);
							request.send(null);
							request.onreadystatechange = function() {
								if(request.readyState == 4) {
									if(request.status == 200) {
										document.getElementById(id).innerHTML = request.responseText;
										that.init(that.callerObj);
									} else {
										var err = "Error: status " + request.status;
										if( checkConsole("error") ) {
											console.error( err );
										} else {
											alert( err );
										}
									}
								}
							}
						} else {
							return true;
						}
						return false;
					},
					onClick: function(e,name) {
						var isExternal = false;
						
						/* NOT WORKING PROPERLY */
						//mobius.Event.remove(name,"click",this.onClick);
						/* ------------------ */
						
						if(!this.ajaxRequest) {
							this.ajaxRequest = true;
						
							if( name.getAttribute ) {
								if( name.getAttribute('rel') === "external" ) {
									isExternal = true;
								}
							} else if(name.attributes) {
								var attributes = name.attributes;
								mobius.each(attributes, function(j,attr) {
									if( attr.name === "rel" && attr.value === "external" ) {
										isExternal = true;
									}
								});
							}
							
							if( !isExternal ) {
								e = mobius.Event.preventDefault(e);
								var href = e.target ? e.target : e.srcElement.href;
								this.update(href,"page");
								return false;
							}
						
						} else {
							e.preventDefault();
							return false;
						}
					}
				};
			})();
			
			if(callerObj) {
				self.pageLoad.init(callerObj);
			} else {
				self.execute();
			}
		})
	});
		
	// for easy access
	mobius.each( ("loadJs loadCss print_r pad isNumeric log do run getElementsByClassName hasClass addClass removeClass getParent getChildren getSiblings getNext getPrevious getFirst getLast firstAndLast Event ajax").split(" "), function( i, name ) {		
		/* Special Cases */
		if( name === "loadJs" ){
			mobius[ name ] = mobius.fn[ name ] = mobius.utilities.loader.js;
			return this;
		}else if( name === "loadCss" ){
			mobius[ name ] = mobius.fn[ name ] = mobius.utilities.loader.css;
			return this;
		}else if( name === "do" || name === "run" ){
			mobius.fn[ name ] = mobius[ name ] = mobius.utilities.executeFunctionByName;
			return this;
		/* Exposing fn functions to mobius */
		}else if( name === "getElementsByClassName" || name === "hasClass" || name === "addClass" || name === "removeClass" || name === "getParent" || name === "getChildren" || name === "getSiblings" || name === "getNext" || name === "getPrevious" || name === "getFirst" || name === "getLast" || name === "firstAndLast" || name === "Event" || name === "ajax" ){
			mobius[ name ] = mobius.fn[ name ];
			return this;
		/* Exposing mobius functions fn (default) */
		}else{
			mobius.fn[ name ] = mobius[ name ];
			return this;
		}
	});
	
})(window);