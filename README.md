## create a webworker
```javascript
    var worker	= EasyWorker.create({
        exports	: {
            add	: function(a, b, callback){
                callback(null, a + b);
            },
            sub	: function(a, b, callback){
                callback(null, a - b);
            }
        }
    });
```

## default function call
```javascript
    worker.call('add', [1, 2], function(err, res){
        console.log("add(1,2)=", res, '/', err);		
    });
    worker.call('sub', [1, 2], function(err, res){
        console.log("sub(1,2)=", res, '/', err);		
    });
```

## shortcut to call
```javascript
    worker.add(1, 2, function(err, res){
        console.log("add(1,2)=", res, '/', err);		
    });
    worker.sub(1, 2, function(err, res){
        console.log("sub(1,2)=", res, '/', err);		
    });
```
