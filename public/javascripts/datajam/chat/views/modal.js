/*jshint laxcomma:true, evil:true, expr:true */
(function(define, require){
  define([
      'text!chat/templates/chat_area/modal.html'
    , 'datajam/views/modal'
    , 'chat/views/moderator_chat'
    , 'chat/views/chat_controls'
    ], function(modaltmpl){

    var $ = jQuery,
      App = Datajam.Chat;

    App.views.Modal = Datajam.views.Modal.extend({

      initialize: function(){
        this.$el.addClass('chat-modal');
      },

      initializeControls: function(){
        this.$el.find('.modal-chat-controls').each(_.bind(function(i, el){
          if($(el).children().length) return false;
          new App.views.ChatControls({ el: el });
        }, this));
        return this;
      },

      render: function(){
        var contentArea = this.model
          , tmpl = _.template(modaltmpl)
          , chat_id = contentArea.view
                             .$el.attr('data-url')
                             .split(/[\/\.]/).slice(-2).shift();

        this.$el.attr('data-chat-id', chat_id)
            .html(tmpl(this.model.toJSON()));

        this.initializeControls();

        return this;
      },

      save: function(){
        Datajam.debug('Save isn\'t implemented in Chat Modals.');
        return this;
      }

    });

  });
})(define, require);
