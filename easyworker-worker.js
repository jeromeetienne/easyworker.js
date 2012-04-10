(function(){
	var console	= {
		log	: function(obj){
			throw "console.log(): "+obj;
		},
		dir	: function(obj){
			throw "console.dir(): "+JSON.stringify(obj, null, '\t')
		},
		assert	: function(condition, message){
			if( condition ) return;
			throw "console.assert() Failed! "+message;
		}
	}
	
	var exports	= {}
	
	/**
	 * to run code in the worker
	*/
	function handleRun(data){
		eval('('+data.fn+')();');
	}
	
	/**
	 * to define a method in the worker
	*/
	function handleDefine(data){
		var codeStr	= 'exports["'+data.fnName+'"] = '+data.method+';';
		eval(codeStr);
	}
	
	/**
	 * to call a defined method 
	*/
	function handleCall(data){
		// log to debug
		console.assert(exports[data.fnName]);
		// push the callback to notify back the caller
		data.fnArgs.push(function(error, result){
			self.postMessage(JSON.stringify({
				type	: 'reply',
				data	: {
					callId	: data.callId,
					error	: error,
					result	: result
				}
			}));
		});
		// actually call the function	
		exports[data.fnName].apply(undefined, data.fnArgs)
	}
	
	// listen to message and route the events
	self.addEventListener('message', function(domEvent){
		// parse message
		console.assert( domEvent.data );
		var event	= JSON.parse(domEvent.data);
		// parse depending on event.type
		if( event.type === "define" ){
			handleDefine(event.data);
		}else if( event.type === "call" ){
			handleCall(event.data);
		}else if( event.type === "run" ){
			handleRun(event.data);
		}else	console.assert(false, "unknown type: "+event.type);
	}, false);
})();