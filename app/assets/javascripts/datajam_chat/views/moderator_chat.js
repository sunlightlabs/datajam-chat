define('views/moderator_chat', [
    'text!templates/chat/show.html'
  , 'text!templates/chat/error.html'
  , 'text!templates/common/flash.html'
  , 'common'
  , 'models/moderator_chat'
  , 'models/message'
  , 'views/incoming_message'
  , 'views/rejected_message'
  , 'collections/moderator_message' ], function(showtmpl, errortmpl, flashtmpl){

  var $ = jQuery
    , App = DJ.Chat
    , message_klasses = {
          'incoming': App.Views.IncomingMessage
        , 'rejected': App.Views.RejectedMessage
      }
    ;

    App.Views.ModeratorChat = Backbone.View.extend({
        events: {

        }
      , initialize: function(){
          //scope class methods
          _.bindAll(this, 'destroy'
                        , 'error'
                        , 'loading'
                        , 'loaded'
                        , 'pause'
                        , 'poll'
                        , 'render'
                        , 'renderCollection'
                        , 'resume'
                        );

          this.loading();

          this.model = new App.Models.ModeratorChat;
          this.model.url = this.el.attr('data-url');
          this.model.set({interval: this.el.attr('data-interval')
                        , _scroll_anchored: true
                        });
          this.model.bind('change', this.render);

          this.collection  = new App.Collections.ModeratorMessage;
          this.collection.url = this.model.url.replace('.json', '/messages.json') + '?status=' + this.el.attr('data-status');
          this.collection.view = this;
          this.collection.bind('reset', this.renderCollection);

          // total hack to keep from zombie-ing collection views
          this.views = {};

          // reverse sort for rejected queue
          if(this.el.attr('data-status') == 'rejected'){
            _.extend(this.collection, {
              comparator: function(obj){
                return Date.parse(obj.get('updated_at')) * -1; // reverse chron
              }
            });
          }

          this.model.fetch()
            .success(_.bind(function(model){
              this.collection.ajaxOptions = _.extend({}, model.ajaxOptions, {});
              this.model.set({name: _(this.el.attr('data-status')).capitalize()});
              this.poll();
            }, this))
            .error(this.error)
            .complete(this.loaded);

        }
      , destroy: function(){
          this.el.remove();
        }
      , error: function(){
          this.el.replaceWith(_.template(errortmpl, {}));
        }
      , loading: function(){
          this.el.addClass('loading');
        }
      , loaded: function(){
          this.el.removeClass('loading');
        }
      , pause: function(){
          this.model.set({'paused': true}, {'silent': true});
        }
      , poll: function(){
          if(this._timeout){
            clearTimeout(this._timeout);
            this._timeout = null;
          }
          if(!this.model.get('paused')){
            this.collection.fetch();
            this._timeout = setTimeout(this.poll, this.model.get('interval'));
          }
        }
      , render: function(){
          var data = this.model.toJSON()
            , html = _.template(showtmpl)

          $(this.el).html(html(data));
          return this;
        }
      , renderCollection: function(){
          var scroller = this.el.find('.comments-clip')
            , content = scroller.find('.comments');

          content.empty();
          this.collection.each(_.bind(function(model, idx){
            var message = this.views[model.id];
            if(!message){
              message = new message_klasses[this.el.attr('data-status')]({ model: model });
              this.views[model.id] = message;
            }
            content.append(message.render().el);
          }, this));
        }
      , resume: function(){
          this.model.set({'paused': false}, {'silent': true});
          this.poll();
        }
    });
});