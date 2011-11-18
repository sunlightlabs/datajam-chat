/**
 * DataJam-Chat
 * Rails Messaging Engine
 * @author Dan Drinkard <ddrinkard@sunlightfoundation.com>
 */
(function($){

  require.config({baseUrl: '/javascripts/datajam_chat'});

  // Define modules
  define('common', [
      'order!vendor/json2'
    , 'order!vendor/underscore'
    , 'order!vendor/backbone'
    , 'vendor/jquery.imagesloaded'
    , 'vendor/jquery.scrollTo-1.4.2-min'
    , 'vendor/moment.min'
  ], function(){
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

  define('upload', [
      'vendor/jquery.form'
  ], $.noop);

  /**
   * Bootstrap
   */
  require(['common', 'views/chat', 'views/moderator_chat'], function(){

    // mixin capitalize func
    _.mixin({
      capitalize : function(string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
      }
    });

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