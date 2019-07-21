// bank.js
var jsonStream = require('duplex-json-stream')
var net = require('net')
var fs = require('fs')
var log = require('./log.json')

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

function save() {
    let data = JSON.stringify(log, null, 2);
    fs.writeFileSync('log.json', data);
}


var server = net.createServer(function (socket) {
    socket = jsonStream(socket)
    socket.on('data', function (msg) {
        console.log('Bank received:', msg)
        let amount = Math.abs(parseInt(msg.amount))
        switch (msg.cmd){
            case 'balance':
                socket.write({ cmd: 'balance', balance: sum() })
                break
            case 'deposit':
                log.push({cmd: 'deposit', amount: amount})
                save()
                socket.write({ cmd: 'balance', balance: sum() })
                break
            case 'withdraw':
                if(amount<=sum()){
                    log.push({cmd: 'withdraw', amount: amount})
                    save()
                    socket.write({ cmd: 'balance', balance: sum() })
                } else {
                    socket.write("insufficient funds")
                }
                break
            default:
                break
        }
        
    })
})

server.listen(3876)

console.log("started bank")
