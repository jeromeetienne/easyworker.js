/**
 * https://developer.mozilla.org/En/DOM/Worker
 * http://www.html5rocks.com/en/tutorials/workers/basics/
*/

/** @namespace */
var EasyWorker	= {};

/**
 * the path to the easyworker-worker.js file.
 * TODO it would be nice to have a single file
*/
EasyWorker.urlWorkerJs	= 'easyworker-worker.js';

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Constructor
*/
EasyWorker.Instance	= function(){
	this._replies	= {};
	this._nextCallId= 42;
	// create the webworker
	this._worker	= new Worker(EasyWorker.urlWorkerJs);
	// listen to 'message' from this._worker
	this._worker.addEventListener('message', function(domEvent) {  
		//console.log("Called back by the worker!\n", domEvent);
		var event	= JSON.parse(domEvent.data);
		// handle event.type === 'reply'
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
};

/**
 * Destructor
*/
EasyWorker.Instance.prototype.destroy	= function(){
	this._worker.terminate();
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * define a function in the woker
*/
EasyWorker.Instance.prototype.define	= function(fnName, method){
	// define alias
	if( !this[fnName] ){
		this[fnName]	= function(){
			var fnArgs	= Array.prototype.slice.call(arguments);
			var method	= fnArgs.pop();
			this.call(fnName, fnArgs, method);
		}
	}
	// send the config and start the worker
	this._worker.postMessage(JSON.stringify({
		type	: 'define',
		data	: {
			fnName	: fnName,
			method	: method.toString()
		}
	}));
};

/**
 * call a function in the worker
*/
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

/**
 * call a function in the worker
*/
EasyWorker.Instance.prototype.run	= function(fn){
	// post message
	this._worker.postMessage(JSON.stringify({
		type	: "run",
		data	: {
			fn	: fn.toString()
		}
	}));
};
