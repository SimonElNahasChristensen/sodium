// bank.js
var jsonStream = require('duplex-json-stream')
var net = require('net')

var log = [
]


function sum() {
    return log.reduce(
        function (accu, x) {
            switch (x.cmd) {
                case 'deposit':
                    return accu + x.amount

                case 'withdraw':
                    return accu - x.amount
                default:
                    return accu
            }
        }
        , 0)
}


var server = net.createServer(function (socket) {
    socket = jsonStream(socket)
    socket.on('data', function (msg) {
        console.log('Bank received:', msg)
        switch (msg.cmd){
            case 'balance':
                socket.write({ cmd: 'balance', balance: sum() })
                break
            case 'deposit':
                log.push({cmd: 'deposit', amount: parseInt(msg.amount)})
                socket.write({ cmd: 'balance', balance: sum() })
                break
            case 'withdraw':
                log.push({cmd: 'withdraw', amount: parseInt(msg.amount)})
                socket.write({ cmd: 'balance', balance: sum() })
                break
            default:
                break
        }
        
    })
})

server.listen(3876)

console.log('test')