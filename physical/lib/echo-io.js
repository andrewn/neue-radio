var util = require('util');
var BoardIO = require('board-io');

var pins = {
  0: {
    pins: [
      'GPIO17',
      'P1-11'
    ],
    peripherals: [
      'gpio'
    ]
  },
  1: {
    pins: [
      'GPIO18',
      'PWM0',
      'P1-12'
    ],
    peripherals: [
      'gpio',
      'pwm'
    ]
  },
  2: {
    pins: [
      'GPIO27',
      'P1-13'
    ],
    peripherals: [
      'gpio'
    ]
  },
  3: {
    pins: [
      'GPIO22',
      'P1-15'
    ],
    peripherals: [
      'gpio'
    ]
  },
  4: {
    pins: [
      'GPIO23',
      'P1-16'
    ],
    peripherals: [
      'gpio'
    ]
  },
  5: {
    pins: [
      'GPIO24',
      'P1-18'
    ],
    peripherals: [
      'gpio'
    ]
  },
  6: {
    pins: [
      'GPIO25',
      'P1-22'
    ],
    peripherals: [
      'gpio'
    ]
  },
  7: {
    pins: [
      'GPIO4',
      'P1-7'
    ],
    peripherals: [
      'gpio'
    ]
  },
  8: {
    pins: [
      'GPIO2',
      'SDA0',
      'P1-3'
    ],
    peripherals: [
      'gpio',
      'i2c'
    ]
  },
  9: {
    pins: [
      'GPIO3',
      'SCL0',
      'P1-5'
    ],
    peripherals: [
      'gpio',
      'i2c'
    ]
  },
  10: {
    pins: [
      'GPIO8',
      'CE0',
      'P1-24'
    ],
    peripherals: [
      'gpio',
      'spi'
    ]
  },
  11: {
    pins: [
      'GPIO7',
      'CE1',
      'P1-26'
    ],
    peripherals: [
      'gpio',
      'spi'
    ]
  },
  12: {
    pins: [
      'GPIO10',
      'MOSI0',
      'P1-19'
    ],
    peripherals: [
      'gpio',
      'spi'
    ]
  },
  13: {
    pins: [
      'GPIO9',
      'MISO0',
      'P1-21'
    ],
    peripherals: [
      'gpio',
      'spi'
    ]
  },
  14: {
    pins: [
      'GPIO11',
      'SCLK0',
      'P1-23'
    ],
    peripherals: [
      'gpio',
      'spi'
    ]
  },
  15: {
    pins: [
      'GPIO14',
      'TXD0',
      'P1-8'
    ],
    peripherals: [
      'gpio',
      'uart'
    ]
  },
  16: {
    pins: [
      'GPIO15',
      'RXD0',
      'P1-10'
    ],
    peripherals: [
      'gpio',
      'uart'
    ]
  },
  21: {
    pins: [
      'GPIO5',
      'P1-29'
    ],
    peripherals: [
      'gpio'
    ]
  },
  22: {
    pins: [
      'GPIO6',
      'P1-31'
    ],
    peripherals: [
      'gpio'
    ]
  },
  23: {
    pins: [
      'GPIO13',
      'P1-33',
      'PWM1'
    ],
    peripherals: [
      'gpio',
      'pwm'
    ]
  },
  24: {
    pins: [
      'GPIO19',
      'PWM1',
      'MISO1',
      'P1-35'
    ],
    peripherals: [
      'gpio',
      'pwm',
      'spi'
    ]
  },
  25: {
    pins: [
      'GPIO26',
      'P1-37'
    ],
    peripherals: [
      'gpio'
    ]
  },
  26: {
    pins: [
      'GPIO12',
      'PWM0',
      'P1-32'
    ],
    peripherals: [
      'gpio',
      'pwm'
    ]
  },
  27: {
    pins: [
      'GPIO16',
      'P1-36'
    ],
    peripherals: [
      'gpio'
    ]
  },
  28: {
    pins: [
      'GPIO20',
      'MOSI1',
      'P1-38'
    ],
    peripherals: [
      'gpio',
      'spi'
    ]
  },
  29: {
    pins: [
      'GPIO21',
      'SCLK1',
      'P1-40'
    ],
    peripherals: [
      'gpio',
      'spi'
    ]
  }
};

function mapPins(pins) {
  return Object.keys(pins).map(function (num) {
    return {
      supportedModes: [0, 1, 3, 4],
      mode: 0,
      value: 0,
      report: 1,
      analogChannel: 127,
    };
  })
}

function EchoIO() {
  // call super constructor
  BoardIO.call(this);

  // .. configure pins
  this._pins = mapPins(pins);

  // wait for an async method or use proccess.nextTick to
  // signal events
  process.nextTick(function() {
    // connect to hardware and emit "connect" event
    this.emit('connect');

    // all done, emit ready event
    this.emit('ready');

  }.bind(this));
}
util.inherits(EchoIO, BoardIO);

module.exports = EchoIO;
