/**
 * DataJam-Chat
 * Rails Messaging Engine
 * @author Dan Drinkard <ddrinkard@sunlightfoundation.com>
 */
(function($, define, require){

  define('chat/common', [
    , 'js!chat/vendor/underscore_mixins.js'
    , 'js!chat/vendor/jquery.imagesloaded.js'
    , 'js!chat/vendor/jquery.scrollTo-1.4.2-min.js'
    , 'js!chat/vendor/moment.min.js'
    ]
  , function(){
      window.Datajam || (Datajam = {});
      Datajam.Chat = {
          Models: {}
        , Views: {}
        , Collections: {}
      };
      Datajam.Chat.csrf = {
          csrf_param: $('meta[name=csrf-param]').attr('content')
        , csrf_token: $('meta[name=csrf-token]').attr('content')
      }
    });

  define('chat/upload', ['js!chat/vendor/jquery.form.js'], $.noop);

  define('chat/tweet', ['js!//platform.twitter.com/widgets.js'], $.noop);

  /**
   * Bootstrap the app
   */
  require(['chat/common', 'chat/views/chat'], function(){

    // Emulate HTTP via _method param
    Backbone.emulateHTTP = true;
    Backbone.emulateJSON = true;

    $(function(){
      var App = Datajam.Chat;
      $('.datajamChatThread').not('.moderator').each(function(){
        new App.Views.Chat({ el: $(this) });
      });
      $('.datajamChatThread.moderator').each(function(){
        require(['chat/views/moderator_chat'], _.bind(function(){
          new App.Views.ModeratorChat({ el: $(this) });
        }, this));
      });
    });

  });


})(jQuery, curl.define, curl);