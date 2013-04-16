mobius.extend({
	called: false,
	go: (function(options,delay){
		this.init = (function(){
			return {
				options: {
					loadDelay: 300,
					ajax: true,
					mouseEvents: {
						enabled: true,
						btnClass: "btn",
						btnGroup: "btn_group",
						btnExclude: "btn_exclude"
					},
					firstAndLast: {
						enabled: true,
						tags: ["ul","li","div","p"]
					},
					device: {
						enabled: true,
						orientationSizes: Array(240,320,480,768,1024),
						orientationTag: "html",
						orientationAttribute: "class"
					},
					support: {
						enabled: true,
						check: {
							js: "jquery",
							css: ['textShadow','borderRadius','boxShadow']
						},
						callback: function() {
							if(mobius.device.gradeA){
								/* LOAD ADDITIONAL */
								//mobius.loadJs('');
								//mobius.loadCss('');
							} else {
								/* LOAD ALTERNATE */
								//mobius.loadJs('');
								//mobius.loadCss('');
							}
						}
					}
				},
				begin: function(delay,options,parent) {
					var self = this;
					
					mobius.extend(self.options, options);
					
					if(delay === undefined) { 
						delay = self.options.loadDelay; 
					}
					
					setTimeout(function() { self.ready.apply(self,[parent]); },delay);
				},
				ready: function(parent) {
					var self = this;
					
					if(this.options.support.enabled) {
						var supportOptions = {
							js: "jquery",
							css: ['textShadow','borderRadius','boxShadow']
						};
						
						mobius.extend(supportOptions, this.options.support.check);
						
						/* decide whether device is smart (enough) */
						mobius.device.support.check(supportOptions.js,supportOptions.css);
						
						window.GRADE_A_DEVICE = mobius.device.gradeA = mobius.device.support.status.gradeA; /* set this variable for possible later use */
						
						this.options.support.callback.call(mobius.device.support);
						
						if(GRADE_A_DEVICE) {
							/* JQUERY ENHANCEMENTS */
							$(function(){
								$('html').addClass('gradeA');
							});
						}
					}
					if(this.options.device.enabled) {
						mobius.device.orientation.load(this.options.device.orientationTag,this.options.device.orientationAttribute,this.options.device.orientationSizes,delay);
					}
					if(this.options.ajax) {
						mobius.ajax({
							type: "load"
						},parent);
					} else {
						parent.domListenersAndManipulation.call(this);
					}
					if(mobius.isready !== undefined){
						mobius.isready.status.ready = true;
					}
				}
			};
		})();
		
		this.domListenersAndManipulation = (function() {
			if(this.init.options.mouseEvents && this.init.options.mouseEvents.enabled){
				mobius.device.mouseEvents.init({btnClass: this.init.options.mouseEvents.btnClass, btnGroup: this.init.options.mouseEvents.btnGroup, btnExclude: this.init.options.mouseEvents.btnExclude});
			}
			if(this.init.options.firstAndLast && this.init.options.firstAndLast.enabled){
				mobius.firstAndLast({tags: this.init.options.firstAndLast.tags});
			}
		});
		
		if(!mobius.called) {
			mobius.called = true;
			this.init.begin.apply(this.init,[delay,options,this]);
		}
	})
});