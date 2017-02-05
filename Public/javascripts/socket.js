var ws = null;

var pingWait = null;

var maxWait = 128000;
var currentWait = 1000;

var nonce = "";

var preventReconnect = false;

var messageCallback = [];

function Jitter() {
    
    return Math.floor(Math.random() * 10);
}

function NewNonce() {
    
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    var length = Math.floor(Math.random() * 10) + 5;

    for(var i = 0; i < length; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function Connect(url, success) {
    
    // Connect
    ws = new WebSocket(url);
    
    // Establish handlers
    ws.onopen = function() {
        
        success();
        
        setTimeout(function() {
            
            ws.send(JSON.stringify({ type: "PING"}));
            pingWait = setTimeout(function() {
                
                ws.close();
            }, 10000);
        }, 180000 + Jitter());
    };
    
    ws.onerror = function() {
        
        setTimeout(function() {
            
            Connect(urlTemp, successTemp);
        }, currentWait);
        currentWait *= 2;
    };
    
    ws.onclose = function() {
        
        console.log("Closed connection.");
        
        if (!preventReconnect)
        {
            setTimeout(function() {

               Connect(url, success); 
            });
        }
    };
    
    ws.onmessage = InterpretMessage;
}

function Listen(topic, auth, msgCallback) {
    
    if (ws != null)
    {
        if (ws.readyState == ws.OPEN)
        {
            nonce = NewNonce();
            var command = {
                "type": "LISTEN",
                "nonce": nonce,
                "data": {
                    topics: [topic],
                    auth_token: auth
                }
            };
            
            console.log(command);
            ws.send(JSON.stringify(command));
            
            for (var i = 0; i < messageCallback.length; i++)
            {
                if (messageCallback[i].topic == topic)
                {
                    return;
                }
            }
            
            messageCallback.push({ topic: topic, callback: msgCallback });
        }
    }
}

//function Fake(topic, msgCallback) {
//    
//    messageCallback.push({ topic: topic, callback: msgCallback });
//}

function InterpretMessage(message) {
    
    console.log(message);
    
    var parsed = JSON.parse(message.data);
    
    if (parsed.type == "RESPONSE")
    {
        if (parsed.nonce != nonce)
        {
            preventReconnect = true;
            ws.close();
        }
        
        if (parsed.error != "")
        {
            console.log(parsed.error);
            preventReconnect = true;
            ws.close();
            messageCallback = [];
        }
        
        return;
    }
    
    if (parsed.type == "PONG")
    {
        if (pingWait != null) { clearTimeout(pingWait); }
        
        setTimeout(function() {
            
            ws.send(JSON.stringify({ type: "PING"}));
            pingWait = setTimeout(function() {
                
                ws.close();
            }, 10000);
        }, 180000 + Jitter());
        
        return;
    }
    
    if (parsed.type == "MESSAGE")
    {
        for (var i = 0; i < messageCallback.length; i++)
        {
            if (messageCallback[i].topic == parsed.data.topic)
            {
                messageCallback[i].callback(JSON.parse(parsed.data.message));
                return;
            }
        }
        
        console.log("Found no use for previous message.");
    }
}