// http://www.zhihua-lai.com/acm
// 09-Feb-2013

// Myrousz 25-Sep-2014
 
// simple chat server
// broadcasts message to other clients
// 'exit' disconnects client

var sys = require('sys');
var net = require('net');
var sockets = [];
 
var svr = net.createServer(function(sock) {
    // connection established
    // !! ports are assigned randomly from user space
    sys.puts('Connected: ' + sock.remoteAddress + ':' + sock.remotePort); 
    sock.write('Hello ' + sock.remoteAddress + ':' + sock.remotePort + '\n');
    sockets.push(sock);
 
    sock.on('data', function(data) {  // client writes message
        if (data == 'exit\n') {
            sys.puts('exit command received: ' + sock.remoteAddress + ':' + sock.remotePort + '\n');
            sock.destroy();
            var idx = sockets.indexOf(sock);
            if (idx != -1) {
                delete sockets[idx];
            }
            return;
        }
        var len = sockets.length;
        for (var i = 0; i < len; i ++) { // broad cast
            if (sockets[i] != sock) {
                if (sockets[i]) {
                    sockets[i].write(sock.remoteAddress + ':' + sock.remotePort + ':' + data);
                }
            }
        }
    });
    sock.on('end', function() { // client disconnects
        sys.puts('Disconnected' +  '\n');
        var idx = sockets.indexOf(sock);
        if (idx != -1) {
            delete sockets[idx];
        }
    });

    // run this after first client is connected...
    if(sockets.length == 1) {
        var frame = 0;
        setInterval(function() {
            frame++
    	    console.log("Sending message from server: "+frame)	 
	    var len = sockets.length;
            for (var i = 0; i < len; i ++) { // broad cast
                if (sockets[i]) {
                    sockets[i].write('Async message from server:' + frame + "\n");
                }
            }
    	}, 2000);
    }
});
 
var svraddr = '127.0.0.1';
var svrport = 9999;
 
svr.listen(svrport, svraddr);
sys.puts('Server Created at ' + svraddr + ':' + svrport + '\n');
