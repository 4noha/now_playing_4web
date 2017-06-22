(function() {
  var username = null;
  var reqData = {
      channel: '#now-playing',
      text:    null
  };

  chrome.runtime.onMessage.addListener( function( message ) {
    if ( message.type === 'nextTrack' ) {
      chrome.storage.local.get( 'options', function( data ) {
        if ( data.options['#gpm'] && message.value['hostname'] === 'play.google.com' ) {
            var trackInfo = message.value['text'];
            trackInfo += data.options['#username'] != null ? `${data.options['#username']}` : '';
            reqData['text'] = trackInfo;
        } else {
          return;
        }
      
        //Bot or User post
        $.ajax({
          type:  'POST',
          url:   data.options['#slack_key'],
          data:  'payload=' + JSON.stringify( reqData ),
          error: function( data ){
            console.log(data);
          }
        });
      });
    }
  });
}).call(this);
