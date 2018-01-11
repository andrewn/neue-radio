# RFID Bridge

Listens for a connected MFC522 card reader and publishes found cards across the WebSocket bridge using the `rfidPresented` topic.

```
{
  "topic": "rfidPresented",
  payload: {
    card: {
      uid: "abc"
    }
  }
}
```

## Wiring

Make sure the card reader can use SPI, then wire it up as follows:

![](https://github.com/firsttris/mfrc522-rpi/raw/master/wiki/rpi-mfrc522-wiring2.PNG)

## Installation

`npm install --producttion`

## Running

`npm start`

## Running on a non-Raspberry Pi

This relies on the SPI interface so will only run on the Pi. Use the `DEBUG=true` flag on a non-Pi to send a fake card message e.g. `DEBUG=true npm start`.
