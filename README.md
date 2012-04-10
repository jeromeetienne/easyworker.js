easyworker makes it easy to create worker.
All is happening in the main thread.
no need to setup external .js for workers.
See
[index.html](https://github.com/jeromeetienne/easyworker.js/blob/master/index.html)
for an example.

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

## call a function in the worker

To call a define function, a shortcut is created for convenience.
Thus you can call the 'add()' function by a line like this.

```javascript
worker.add(1, 2, function(err, res){
    console.log("add(1,2)=", res, '/', err);		
});
```

For completness, ```.call()``` is the canonical way to call a function.
But it isnt too instinctive.

```javascript
worker.call('add', [1, 2], function(err, res){
    console.log("add(1,2)=", res, '/', err);		
});
```
