/**
 * https://developer.mozilla.org/En/DOM/Worker
 * http://www.html5rocks.com/en/tutorials/workers/basics/
*/

var EasyWorker	= {};

EasyWorker.create	= function(opts){
	return new EasyWorker.Instance(opts);
}

EasyWorker.Instance	= function(opts){
	this._replies	= {};
	this._nextCallId= 42;
	this._worker	= new Worker('easyworker-worker.js');
	var worker	= this._worker;

	worker.addEventListener('message', function(domEvent) {  
		//console.log("Called back by the worker!\n", domEvent);
		var event	= JSON.parse(domEvent.data);
		if( event.type === 'reply' ){
			var callId	= event.data.callId;
			var error	= event.data.error;
			var result	= event.data.result
			//console.log("event", callId, error, result);
			var callback	= this._replies[callId];
			console.assert(callback, "no callback for this callId");
			delete this._replies[callId];
			callback(error, result);
		}else	console.assert(false, 'unexpected data type');
	}.bind(this), false);

	// compute worker configuration
	var config	= {
		type	: "config",
		data	: { exports : {} }
	};
	for( var fnName in opts.exports ){
		config.data.exports[fnName]	= opts.exports[fnName].toString();
		if( this[fnName] )	continue;
		(function(fnName){
			this[fnName]	= function(){
				var fnArgs	= Array.prototype.slice.call(arguments);
				var callback	= fnArgs.pop();
				this.call(fnName, fnArgs, callback);
			}
		}.bind(this))(fnName);
	}
	// send the config and start the worker
	worker.postMessage(JSON.stringify(config));
};


EasyWorker.Instance.prototype.call	= function(fnName, fnArgs, callback){
	// get callId
	var callId	= this._nextCallId++;
	// register the replies
	console.assert(! this._replies[callId]);
	this._replies[callId]	= callback;
	// post message
	this._worker.postMessage(JSON.stringify({
		type	: "call",
		data	: {
			callId	: callId,
			fnName	: fnName,
			fnArgs	: fnArgs
		}
	}));
};
