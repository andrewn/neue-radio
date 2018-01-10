class YouTube {
  constructor(rootEl) {
    this.element = document.createElement('div');
    rootEl.appendChild(this.element);
  }
  play(url) {
    const videoId = new URL(url).searchParams.get('v');

    this.player = new YT.Player(this.element, {
      videoId,
      events: {
        onReady: () => this.player.playVideo()
        // 'onStateChange': onPlayerStateChange
      }
    });
  }
  stop() {
    this.player.stopVideo();
  }
}

YouTube.ready = false;

// I know, right?
window.onYouTubeIframeAPIReady = () => {
  YouTube.ready = true;
};
