easyworker makes it easy to create worker.
All is happening in the main thread.
no need to setup external .js for workers.

## create a webworker

Before doing anything, you need to create an instance of worker

```javascript
    var worker	= EasyWorker.create();
```

## run code in the woker

```.run()``` will run a function in the worker. don't expect a return value.
It is typically used to initialized your worker e.g. to load dependancies via
[importScripts()](https://developer.mozilla.org/En/Using_web_workers#Importing_scripts_and_libraries).

```javascript
worker.run(function(){
    importScripts('foo.js');
});
```

## define a function

```.define``` defines a function to run in the worker

```javascript
worker.define('add', function(a, b, callback){
    callback(null, a + b);
});
```

## generic function call

To call a defined function, you can use```.call()```.

```javascript
worker.call('add', [1, 2], function(err, res){
    console.log("add(1,2)=", res, '/', err);		
});
```

### shortcut to call

```.call()``` is the canonical way, but it isnt too instinctive.
For convenience, a shortcut is created. thus you can call the 'add()' function
by a line like this.

```javascript
worker.add(1, 2, function(err, res){
    console.log("add(1,2)=", res, '/', err);		
});
```
