Datajam = {
    DEBUG: false
  , debug: function(msg){
      Datajam.DEBUG && window.console && console.log(msg);
    }
}
curl = {
    baseUrl: '/public/javascripts'
  , pluginPath: '/spec/datajam/public/javascripts/curl/plugin'
  , paths: {
        chat: '/public/javascripts/datajam_chat'
      }
  }