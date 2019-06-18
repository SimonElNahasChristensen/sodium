// teller.js
var jsonStream = require('duplex-json-stream')
var net = require('net')

var client = jsonStream(net.connect(3876))

client.on('data', function (msg) {
  console.log('Teller received:', msg)
})

const args = process.argv.slice(2)
const command = args[0]
const amount = parseInt(args[1])

switch (command){
    case 'balance':
        client.end({cmd: 'balance'})
        break
    case 'deposit':
        client.end({cmd: 'deposit', amount: amount})
        break
    case 'withdraw':
        client.end({cmd: 'withdraw'})
        break
    default:
        break
}


