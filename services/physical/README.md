# Physical

Summary: Read and control things connected to the Pi's GPIO pins.

## Install

This will only work on the Raspberry Pi so it's doesn't make much sense to install on it's own.

However, you can run:

    git clone <this repo>
    cd <this repo>
    JOBS=max npm install --production

## Running

The service uses a config file to know which components are connected to which pins. 

## Configuration

To configure the attached components, edit the file `config/physical-config.json`. The file's structured:

```json
{
    "<component-type>": [
        {
            "id": "<component-id>",
            "config": {
                "<component-specific-config>": "something"
            }
        }
    ]
}
```

There are example configs in the `config` directory to use as a basis.

## Protocol

### Listen to a component

`physical/event/<component-type>-<component-id>-<event-name>`

For example, a button with id "power" will emit the following when pressed:

`physical/event/button/power/press`

### Command a component

`physical/command/<component-type>-<component-id>-<command-name>`

For example, change an "ledrgb" called "power" colour to green:

Topic: `physical/command/ledrgb-power-colour`
Payload: `{ rgb: [0, 255, 0]}`

## Available components, events and commands

### Button

Type: `button`

#### Events:

event-name: `press`
Payload: `{ pressed: true }`

event-name: `hold`
Payload: `{ pressed: true, durationMs: 3000 }`

event-name: `release`
Payload: `{ pressed: false }`

### Red/Green/Blue LED

Type: `ledrgb`

#### Commands:

command-name: `change`
Payload: `{ isOn: true, color: [255, 255, 255 ]}`

`isOn` turns the LED on/off

`color` can be an array of [r,g,b] or a CSS colour string e.g. '#ff0000'

command-name: `status`

Emits an event with name `status` containing the state of the LED.

`{ color: rgbColor, isOn: boolean }`


Color values can be:

| Any CSS color name string | "red", "green", "blue"|
| Hexadecimal color strings | "ff0000", "00ff00", "0000ff"|
| Hexadecimal color strings, w/ leading # | "#ff0000", "#00ff00", "#0000ff"|
| Array of values 0-255 | [255, 128, 4] |

### Rotary Encoder

Type: `encoder`

#### Events

event-name: `turn`
Payload: `{ value: number }`

An ever-increasing or decreasing number. Positive numbers indicate clockwise, negative indicate anticlockwise. These do not correspond to a full-rotation of the encoder.

### 64x64 LED Matrix

Type: `ledmatrix`

command-name: `draw`
Payload: `{ data: See below }`

`data` can be:

* A single character string, eg. "A", "b", "1", "$"
* An array (with 8 or 16 elements) of 8-bit or 16-bit values, eg. [0x00, 0x04, 0x15, 0x0E, 0x15, 0x04, 0x00, 0x00] (That array represents * character). The dimensions of the character array must match the dimensions of the matrix i.e. 8x8
* An 8 element array of 8 character long strings, where each character represents the on/off/color state of the LED at that position in the matrix, eg. 

```
[
  "01100110",
  "10011001",
  "10000001",
  "10000001",
  "01000010",
  "00100100",
  "00011000",
  "00000000"
];
```

### Capacitive touch sensor

Type: `capacitive`

command-name: `reset-request`
Resets the capacitive touch board, recalibrating the sensors.

command-name: `status-request`
Emits an event about the current sensitivity.

command-name: `sensitivity`
Payload: `{ sensitivity: number }`
Sets the sensitivity of the capacitive touch sensor, the level at which it registers a touch.

### Events

event-name: `reset`
Emitted when the capacitive touch board is reset.

event-name: `change`
Payload: { changes: changes, touches: currentTouches }

Emitted when the state of the touched pins changes.

`changes` is an array of `{ id, touched }` objects. `id` is the pin number. `touched` is a boolean indicating if the pin is touched. `changes` only contains the pins that have changed state.

`touches` is an array of boolean values for each pin.

Example change event when sensor id 2 has been touched:

```
{
    changes: [{ id: 2, touchd: true }],
    touches: [false, false, true, false, true, false, false, false]
}
```

## Libraries

The service is a wrapper around the following libraries:

* Buttons, RGB LEDs, Rotary Encoder, LED Matrices ([Johnny-Five](http://johnny-five.io))
* Rotary Encoders ([andrewn/raspi-rotary-encoder](https://github.com/andrewn/raspi-rotary-encoder))
* Capacitive touch sensor (CAP1188) ([andrewn/raspi-cap](https://github.com/andrewn/raspi-cap))

