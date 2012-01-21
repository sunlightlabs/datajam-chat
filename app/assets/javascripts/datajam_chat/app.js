/**
 * DataJam Chat
 * Rails Messaging Engine
 * @author Dan Drinkard <ddrinkard@sunlightfoundation.com>
 */
(function($, define, require){

  define('chat/common', [
    , 'js!chat/plugins/underscore_mixins.js'
    , 'js!chat/plugins/jquery.imagesloaded.js'
    , 'js!chat/plugins/jquery.scrollTo-1.4.2-min.js'
    , 'js!chat/plugins/moment.min.js'
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

  define('chat/upload', ['js!chat/plugins/jquery.form.js'], $.noop);

  define('chat/tweet', ['js!//platform.twitter.com/widgets.js'], $.noop);

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
        $('#' + $(this).attr('data-controls-modal')).find('.modal-chat-controls').each(_.bind(function(){
          require(['chat/views/chat_controls'], _.bind(function(){
            new App.Views.ChatControls({ el: $(this) });
          }, this));
          $('body').undelegate('a[data-controls-modal]', 'click.chat');
        }, this);
      });
    });

  });


})(jQuery, curl.define, curl);