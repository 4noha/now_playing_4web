(function() {
  slack_key = null;
  defaultSlackKey = 'Organization\'s Token';

  // Formからユーザデータ保存の為のデータ構造を作成
  var gather_form_data = function(form) {
    var $form, data;
    $form = $(form);
    data = {};
    $form.find('input[name]').each(function() {
      var name, value;
      name = this.name;
      value = this.value;
      if (this.type === 'checkbox') {
        console.log(this.checked);
        value = this.checked;
      } else if (this.type === 'text') {
        console.log($(this).val());
        value = $(this).val();
      }
      data[name] = value;
    });
    return data;
  };

  var executeScripts = function( tabId, injectDetailsArray ) {
    var callback, createCallback, i;
    createCallback = function(tabId, injectDetails, innerCallback) {
      return function() {
        return chrome.tabs.executeScript( tabId, injectDetails, innerCallback );
      };
    };
    callback = null;
    if ( typeof tabId !== 'number' ) {
      injectDetailsArray = tabId;
      tabId = null;
    }
    i = injectDetailsArray.length - 1;
    while ( i >= 0 ) {
      callback = createCallback( tabId, injectDetailsArray[i], callback );
      --i;
    }
    if ( callback !== null ) {
      callback();
    }
  };


  // Chrome strageへ保存
  var set_options = function( options ) {
    return new Promise(function( resolve ) {
      return chrome.storage.local.set({
        'options': options
      }, function() {
        return resolve();
      });
    });
  };

  var run_checker = function() {
    var options = gather_form_data( '#form' );
    set_options(options).then(function() {
      return executeScripts([
        {
          file: "js/jquery-2.1.1.min.js"
        }
      ]);
    });
  };

  var main = function() {
    $('#username').keyup( function(e) {
      if ( typeof e !== 'undefined' ) {
        e.preventDefault();
      }
      run_checker();
    });

    $('#slack_key').keyup( function(e) {
      $.ajax( { url: $('#slack_key').val() } )
       .always( function( res ) {
        if ( res.status == 400 ){
          slack_key = $('#slack_key').val();
          $('#slack_key_valid').text( 'Slack Hook URL☑' );
          if ( typeof e !== 'undefined' ) {
            e.preventDefault();
          }
          run_checker();
        } else {
          $('#slack_key_valid').text( 'Slack Hook URL' );
        }
      });
    });

    $('#gpm').change( function(e) {
      if ( typeof e !== 'undefined' ) {
        e.preventDefault();
      }
      run_checker();
    });

    $('#youtube').change( function(e) {
      if ( typeof e !== 'undefined' ) {
        e.preventDefault();
      }
      run_checker();
    });


    // Slack API Default Key
    if ( defaultSlackKey != 'Organization\'s Token' ) {
      $.ajax( { url: defaultSlackKey } )
      .always( function( res ) {
        if ( res.status == 400 ) {
          slack_key = defaultSlackKey;
          $('#slack_key_valid').text( 'Slack Hook URL☑' );
        }
      });
    }

    chrome.storage.local.get('options', function(data) {
      return $('#form input').each(function() {
        if ( this.type == 'checkbox' ) {
          this.checked = data.options[this.name];

        } else if ( this.type == 'text' ) {
          if ( this.id == 'slack_key' ) {
            $.ajax( { url: data.options[this.name] } )
            .always( function( res ) {
              if ( res.status == 400 ) {
                if ( defaultSlackKey != null ) {
                  slack_key = data.options[this.name];
                } else {
                  $('#slack_key_valid').text( 'Slack Hook URL☑' );
                  run_checker();
                }
              }
            });
          }

          $(this).val( data.options[this.name] );
        }
        return null;
      });
    });
  };

  main();

}).call(this);
