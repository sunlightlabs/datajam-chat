/**
 * DataJam-Chat
 * Rails Messaging Engine
 * @author Dan Drinkard <ddrinkard@sunlightfoundation.com>
 */
(function(){

  require.config({baseUrl: '/javascripts/datajam_chat'});

  // Declare namespace
  window.DJ || (DJ = {});
  DJ.Chat = {
      Models: {}
    , Views: {}
    , Collections: {}
  };

  DJ.Chat.uploadifyOptions = {
      auto: true
    , buttonImage: '/images/datajam_chat/attachment.png'
    , cancelImage: '/javascripts/datajam_chat/vendor/uploadify/uploadify-cancel.png'
    , swf: '/javascripts/datajam_chat/vendor/uploadify/uploadify.swf'
    , uploader: '/chats/upload.json'
    , checkExisting: false
    , width: 18
    , height: 18
  }

  // Define modules
  define('common', [
    , 'order!vendor/underscore'
    , 'order!vendor/json2'
    , 'order!vendor/backbone'
    , 'vendor/jquery.scrollTo-1.4.2-min'
  ], function(){});

  /**
   * Bootstrap
   */
  require(['common', 'views/chat'], function(){

    jQuery.noConflict();
    var $ = jQuery;

    $(function(){
      var App = DJ.Chat;
      $('.datajam-chat-thread').each(function(){
        $(this).data('chat', new App.Views.Chat({ el: $(this) }));
      });
    });

  });


})();