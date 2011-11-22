/**
 * DataJam-Chat
 * Rails Messaging Engine
 * @author Dan Drinkard <ddrinkard@sunlightfoundation.com>
 */
(function($){

  /**
   * Set up require.js
   */
  require.config({baseUrl: '/javascripts/datajam_chat'});

  define('common', [
      'order!vendor/json2'
    , 'order!vendor/underscore'
    , 'order!vendor/underscore_mixins'
    , 'order!vendor/backbone'
    , 'vendor/jquery.imagesloaded'
    , 'vendor/jquery.scrollTo-1.4.2-min'
    , 'vendor/moment.min'
    ]
  , function(){
      window.DJ || (DJ = {});
      DJ.Chat = {
          Models: {}
        , Views: {}
        , Collections: {}
      };
      DJ.Chat.csrf = {
          csrf_param: $('meta[name=csrf-param]').attr('content')
        , csrf_token: $('meta[name=csrf-token]').attr('content')
      }
    });

  define('upload', ['vendor/jquery.form'], $.noop);

  define('tweet', ['//platform.twitter.com/widgets.js'], $.noop);

  /**
   * Bootstrap the app
   */
  require(['common', 'views/chat', 'views/moderator_chat'], function(){

    // Emulate HTTP via _method param
    Backbone.emulateHTTP = true;
    Backbone.emulateJSON = true;

    $(function(){
      var App = DJ.Chat;
      $('.datajam-chat-thread').not('.moderator').each(function(){
        $(this).data('chat', new App.Views.Chat({ el: $(this) }));
      });
      $('.datajam-chat-thread.moderator').each(function(){
        $(this).data('chat', new App.Views.ModeratorChat({ el: $(this) }));
      });
    });

  });


})(jQuery);