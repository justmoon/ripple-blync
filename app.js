var blync = require('blync');
/* Loading ripple-lib with Node.js */
var Remote = require('ripple-lib').Remote;

/* Loading ripple-lib in a webpage */
// var Remote = ripple.Remote;

var remote = new Remote({
  // see the API Reference for available options
  trusted:        true,
  local_signing:  true,
  local_fee:      true,
  fee_cushion:     1.5,
  servers: [
    {
        host:    's1.ripple.com'
      , port:    443
      , secure:  true
    }
  ]
});

var device = blync.getDevice(0);

device.turnOff();
remote.connect(function() {
  remote.on('ledger_closed', function () {
    console.log('LEDGER');
    device.flashColor('blue');
  });
  remote.requestSubscribe(['transactions_proposed']).request();
  remote.on('transaction', function (msg) {
    if (msg.validated) return;
    console.log('TRANSACTION', msg.transaction.TransactionType);
    switch (msg.transaction.TransactionType) {
    case 'Payment':
      device.flashColor('green');
      break;
    case 'OfferCreate':
      device.flashColor('yellow');
      break;
    case 'OfferCancel':
      device.flashColor('red');
      break;
    default:
      device.flashColor('magenta');
    }
  });
});

process.on( 'SIGINT', function() {
  device.turnOff();
  process.exit(0);
})
