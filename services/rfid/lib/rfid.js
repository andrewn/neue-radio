let mfrc522 = null;

const DEBUG = process.env.DEBUG;

// Try to handle not running on a Pi more gracefully
try {
  mfrc522 = require('mfrc522-rpi');
} catch (e) {
  console.warn('RFID library not found. Are you on a Pi?\n\n');

  if (!DEBUG) {
    throw new Error(e);
  }
}

if (mfrc522 == null) {
  mfrc522 = {
    initWiringPi: () => {},
    reset: () => {},
    findCard: () => ({ status: '💯' }),
    getUid: () => ({ status: '💯', data: new Buffer('FAKE') })
  };
}

// Init WiringPi with SPI Channel 0
mfrc522.initWiringPi(0);

// This loop keeps checking for chips. If one is near it will get the UID and authenticate
console.log('Scanning...');
console.log('Please put chip or keycard in the antenna inductive zone!');
console.log('Press Ctrl-C to stop.');

const CARD_QUERY_INTERVAL_MS = 500;

/*
  
*/
let currentCardPresented = null;

const hex = num => (num < 10 ? '0' + num : num.toString(16));
const hexString = array => array.map(hex).join('');

const scan = ({ error, presented, removed }) => () => {
  // reset card
  mfrc522.reset();

  const response = mfrc522.findCard();
  if (!response.status) {
    // No card
    if (currentCardPresented != null) {
      removed({ uid: currentCardPresented });
      currentCardPresented = null;
    }
    return;
  }

  const uidResponse = mfrc522.getUid();
  if (!uidResponse.status) {
    error({ message: 'Scan Error' });
    return;
  }

  const uid = hexString(uidResponse.data);

  if (currentCardPresented === uid) {
    return;
  }

  if (currentCardPresented != null) {
    removed({ uid: currentCardPresented });
  }

  currentCardPresented = uid;

  presented({ uid });
};

let scanIntervalId = null;

const rfid = handler => {
  scanIntervalId = setInterval(scan(handler), CARD_QUERY_INTERVAL_MS);

  return {
    destroy: () => clearInterval(scanIntervalId)
  };
};

module.exports = rfid;
