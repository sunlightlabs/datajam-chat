/*jshint laxcomma:true, expr:true, evil:true */
(function($, define, require){

  define([ 'datajam/init'
         , 'chat/libs/underscore_mixins'
         , 'chat/libs/jquery.imagesloaded'
         , 'chat/libs/jquery.scrollTo-1.4.2-min'
         , 'chat/libs/jquery.form'
         , '//cdnjs.cloudflare.com/ajax/libs/moment.js/1.7.0/moment.min.js'
         , '//platform.twitter.com/widgets.js'
         ], function(){

    window.Datajam || (Datajam = {});
    Datajam.Chat = {
        models: {}
      , views: {}
      , collections: {}
    };
    Datajam.Chat.constants = {
      deleted_message_text: '[deleted]'
    };
  });

})(jQuery, define, require);