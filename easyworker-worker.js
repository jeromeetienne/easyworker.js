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
 * handle the config
*/
function handleDefine(data){
	var codeStr	= 'exports[data.fnName] = '+data.method+';';
	//console.log("codeStr "+codeStr);
	eval(codeStr);
}

/**
 * handle the call
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

// just echo
self.addEventListener('message', function(domEvent){
	if( !domEvent.data )	return;
	// parse message
	var event	= JSON.parse(domEvent.data);
	// parse depending on event.type
	if( event.type === "define" ){
		handleDefine(event.data);
	}else if( event.type === "call" ){
		handleCall(event.data);
	}else	console.assert(false);
}, false);