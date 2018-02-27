# Downloader Service

Uses the `youtube-dl` command to download and then serve video files over HTTP.

Listens to the `downloader/command/request` command, and responds with a `downloader/event/available` event.

## Install

`brew install youtube-dl`
`npm i`

## Running
`npm start`

Ensure the manager is running in order to communicate over web sockets.

To see a demo of the downloader in action, set `DEBUG=true`.
To change the port that the HTTP server binds to, set, e.g. `PORT=4000`
