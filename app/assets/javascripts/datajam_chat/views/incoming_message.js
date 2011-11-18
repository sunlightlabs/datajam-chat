define('views/incoming_message', [
    'text!templates/message/incoming.html'
  , 'common'
  , 'views/message'
  , 'models/message' ], function(showtmpl){

  var $ = jQuery
    , App = DJ.Chat
    ;

    App.Views.IncomingMessage = App.Views.Message.extend({
        events: {
            "click .approve": "approve"
          , "click .reject": "reject"
        }
      , initialize: function(args){
          _.bindAll(this, 'approve', 'empty', 'loading', 'reject', 'render', '_url');

          this.model || (this.model = new App.Models.Message);
          this.model.bind('change', this.render);
        }
      , approve: function(evt){
          evt.preventDefault();
          this.loading();
          this.model.url = this._url();
          this.model.set({is_moderated:true, is_public: true}, {silent: true});
          this.model.save()
            .success(_.bind(function(){
              $('#' + $(this.el).attr('id')).remove();
            }, this))
            .error(function(){
              alert('There was an error approving this message.');
            });

        }
      , empty: function(){
          $(this.el).html('');
        }
      , loading: function(){
          $(this.el).addClass('loading');
        }
      , reject: function(evt){
          evt.preventDefault();
          this.loading();
          this.model.url = this._url();
          this.model.set({is_moderated:true, is_public: false}, {silent: true});
          this.model.save()
            .success(_.bind(function(){
              $('#' + $(this.el).attr('id')).remove();
            }, this))
            .error(function(){
              alert('There was an error rejecting this message.');
            });
        }
      , render: function(){
          var data = this.model.toJSON();
          data.text = this._strip_tags(data.text);
          data.text = this._linkify(data.text);
          data.text = this._imgify(data.text);
          data.text = this._spaceify(data.text);
          data.text = this._linebreaks(data.text);
          this.el = $(this.el).replaceWith(_.template(showtmpl, data));
          this.delegateEvents();
          return this;
        }
      , _url: function(){
          return $(this.el).parents('.datajam-chat-thread').data('chat').model.url.replace(/\.json.*/, '/messages/' + this.model.id + '.json');
        }
    });

});