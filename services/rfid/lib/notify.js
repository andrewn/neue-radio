const presentedTopic = 'rfid/event/presented';
const removedTopic = 'rfid/event/removed';
const errorTopic = 'rfid/event/error';

module.exports = send => {
  return {
    presented: card => {
      console.log('CARD PRESENTED:', card);
      send(presentedTopic, { card });
    },
    removed: card => {
      console.log('CARD REMOVED: ', card);
      send(removedTopic, card);
    },
    error: error => {
      console.error('CARD ERROR', error);
      send(errorTopic, error);
    }
  };
};
