(function() {
  trackInfo = null;

  setInterval( function() {
    if ( document.getElementById('currently-playing-title') ) {
      var nextTrack = 'Now Playing - ';
      nextTrack += `${document.getElementById('currently-playing-title').title} / `;
      nextTrack += `${document.getElementById('player-artist').innerHTML} ♫♫ `;

      if ( trackInfo != nextTrack ) {
        trackInfo = nextTrack;

        chrome.extension.sendMessage({
          type: 'nextTrack',
          value: { 'hostname': window.location.hostname, text: nextTrack }
        });
      }
    }
  }, 2000);

}).call(this);
