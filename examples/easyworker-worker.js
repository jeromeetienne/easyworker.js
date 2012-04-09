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
var configured	= false;

/**
 * handle the config
*/
function handleConfig(msgData){
	for( var fnName in msgData.exports ){
		var fnString	= msgData.exports[fnName];
		var codeStr	= 'exports[fnName] = '+fnString+';';
		eval(codeStr);
	}
}

/**
 * handle the call
*/
function handleCall(msgData){
	var fnName	= msgData.fnName;
	var fnArgs	= msgData.fnArgs;
	var callId	= msgData.callId;
	// log to debug
	console.assert(exports[fnName]);
	// push the callback to notify the error
	fnArgs.push(function(error, result){
		self.postMessage(JSON.stringify({
			type	: 'reply',
			data	: {
				callId	: callId,
				error	: error,
				result	: result
			}
		}));
	});
	// actually call the function	
	exports[fnName].apply(undefined, fnArgs)
}

// just echo
self.addEventListener('message', function(domEvent){
	if( !domEvent.data )	return;
	// parse message
	var event	= JSON.parse(domEvent.data);
	// parse depending on event.type
	if( event.type === "config" ){
		configured	= true;
		handleConfig(event.data);
	}else if( event.type === "call" ){
		console.assert(configured);
		handleCall(event.data);
	}else	console.assert(false);
}, false);