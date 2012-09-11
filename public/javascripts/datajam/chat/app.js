/**
 * DataJam Chat
 * Rails Messaging Engine
 * @author Dan Drinkard <ddrinkard@sunlightfoundation.com>
 */
(function($, define, require){

  define('chat/common', [
      'chat/libs/underscore_mixins'
    , 'chat/libs/jquery.imagesloaded'
    , 'chat/libs/jquery.scrollTo-1.4.2-min'
    , 'chat/libs/moment.min'
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
      };
      Datajam.Chat.constants = {
          deleted_message_text: '[deleted]'
      };
      // ensure we have the real token
      $('document').bind('csrfloaded', function(){
        Datajam.Chat.csrf.csrf_token = $('meta[name=csrf-token]').attr('content');
      });
    });

  define('chat/upload', ['chat/libs/jquery.form'], $.noop);

  define('chat/tweet', ['//platform.twitter.com/widgets'], $.noop);

  // Bootstrap the app
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
      $('body').delegate('a[data-controls-modal]', 'click.chat', function(){
        $('.chat-modal').find('.modal-chat-controls').each(function(){
          require(['chat/views/chat_controls'], _.bind(function(){
            new App.Views.ChatControls({ el: $(this) });
          }, this));
          $('body').undelegate('a[data-controls-modal]', 'click.chat');
        });
      });
    });

  });


})(jQuery, curl.define, curl);