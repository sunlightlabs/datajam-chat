/*jshint laxcomma:true, expr:true, evil:true */
/**
 * DataJam Chat
 * Rails Messaging Engine
 * @author Dan Drinkard <ddrinkard@sunlightfoundation.com>
 */
(function($, define, require){

  // Bootstrap the app
  require(['chat/init', 'chat/views/chat'], function(){

    $(function(){
      var App = Datajam.Chat;
      $('.datajamChatThread').not('.moderator').each(function(){
        new App.views.Chat({ el: $(this) });
      });
      $('.datajamChatThread.moderator').each(function(){
        require(['chat/views/moderator_chat'], _.bind(function(){
          new App.views.ModeratorChat({ el: $(this) });
        }, this));
      });
    });

  });

})(jQuery, define, require);