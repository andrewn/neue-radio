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

const CARD_QUERY_INTERVAL_MS = 500;

const hex = num => (num < 10 ? '0' + num : num.toString(16));
const hexString = array => array.map(hex).join('');

const scan = ({ error, presented, removed }) => (currentUid = null) => {
  // reset card
  mfrc522.reset();

  const cardResponse = mfrc522.findCard();
  if (!cardResponse.status) {
    // No card
    if (currentUid != null) {
      removed({ uid: currentUid });
    }
    return;
  }

  const uidResponse = mfrc522.getUid();
  if (!uidResponse.status) {
    error({ message: 'Scan Error' });
    return;
  }

  const uid = hexString(uidResponse.data);

  if (currentUid === uid) {
    return currentUid;
  }

  if (currentUid != null) {
    removed({ uid: currentUid });
  }

  presented({ uid });

  return uid;
};

const rfid = handler => {
  let currentCard;
  const scanner = scan(handler);

  // Init WiringPi with SPI Channel 0
  mfrc522.initWiringPi(0);

  console.log('Begin scanning...');

  const scanIntervalId = setInterval(() => {
    currentCard = scanner(currentCard);
  }, CARD_QUERY_INTERVAL_MS);

  return {
    destroy: () => clearInterval(scanIntervalId)
  };
};

module.exports = rfid;
