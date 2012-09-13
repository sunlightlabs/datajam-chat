window.Datajam || (Datajam = {});
Datajam.eventId = null;
Datajam.eventSlug = null;
Datajam.settings || (Datajam.settings = {
    debug: true
  , interval: 5000
});
Datajam.debug = function(msg){
  Datajam.settings.debug && window.console && console.log(msg);
};
require = {
    baseUrl: '/spec/datajam/public/javascripts/libs/require'
  , paths: {
        datajam: '/spec/datajam/public/javascripts/datajam'
      , chat: '/public/javascripts/datajam/chat'
    }
};
