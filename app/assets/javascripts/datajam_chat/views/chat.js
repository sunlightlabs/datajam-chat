define('views/chat', [
    'text!templates/chat/show.html'
  , 'text!templates/chat/error.html'
  , 'text!templates/chat/identity.html'
  , 'text!templates/chat/flash.html'
  , 'text!templates/message/new.html'
  , 'common'
  , 'vendor/uploadify/jquery.uploadify.min'
  , 'models/chat'
  , 'models/message'
  , 'views/message'
  , 'collections/message' ], function(showtmpl, errortmpl, identitytmpl, flashtmpl, newmessagetmpl){

  var $ = jQuery
    , App = DJ.Chat
    ;

    App.Views.Chat = Backbone.View.extend({
        events: {
            "submit form[name=new_message]": "submit"
          , "submit form[name=identify]": "identify"
          , "blur textarea": "handleBlur"
          , "click .destroy-identity": "destroyIdentity"
          , "focus textarea": "handleFocus"
          , "keydown textarea": "handleKeyDown"
          , "chatWindow:scroll": "handleScroll"
        }
      , initialize: function(){
          //scope class methods
          _.bindAll(this, 'addMessage'
                        , 'destroy'
                        , 'destroyIdentity'
                        , 'error'
                        , 'handleBlur'
                        , 'handleFocus'
                        , 'handleKeyDown'
                        , 'handleScroll'
                        , 'identify'
                        , 'loading'
                        , 'loaded'
                        , 'pause'
                        , 'poll'
                        , 'prevPage'
                        , 'render'
                        , 'resume'
                        , 'submit'
                        );
          this.loading();

          this.model = new App.Models.Chat;
          this.model.url = this.el.attr('data-url');
          this.model.set({interval: this.el.attr('data-interval'), _scroll_anchored: true});
          this.model.bind('change', this.render);

          // get identity if available
          $.ajax({
            'url': '/chats/identity.json',
            'dataType': 'json'
          }).success(_.bind(function(data){
            if (data.display_name){
              this.model.set({'display_name': data.display_name});
            }
          }, this));

          this.collection = new App.Collections.Message;
          this.collection.view = this;
          this.collection.bind('add', this.addMessage);

          this.model.fetch()
            .success(_.bind(function(model){
              this.collection.url = this.model.url.replace('.json', '/chat_pages/' + model.page._id + '.json');
              this.collection._newest_seen_page = model.page.next_page || this.collection.url;
              this.collection._oldest_seen_page = model.page.prev_page;
              this.collection.ajaxOptions = model.ajaxOptions;
              this.poll();
            }, this))
            .error(this.error)
            .complete(this.loaded);

        }
      , addMessage: function(model){
          var scroller = this.el.find('.comments-clip')
           ,  content = scroller.find('.comments');
          this.model.set({interval:this.el.attr('data-interval')}, {'slient': true});
          new App.Views.Message({
              model: model
            , el: '#' + this.el.find('ul').eq(0).attr('id') + '>li'
            , _anchored: this.model.get('_scroll_anchored')
          });
          if(content.height() < scroller.height()) scroller.trigger('scroll');
          // scroll to bottom of window if we are anchored
          if(this.model.get('_scroll_anchored')){
            $.when(scroller.find('img').load($.noop)).then(function(){
              scroller.stop().scrollTo('100%', 100, 'swing');
            });
          }
        }
      , destroy: function(){
          this.el.remove();
        }
      , destroyIdentity: function(evt){
          evt.preventDefault();
          if(this.model.get('display_name')){
            $.ajax({
                url: '/chats/identity/destroy.json'
              , type: 'post'
              , dataType: 'json'
              , data: {display_name: this.model.get('display_name')}
            });
          }
          this.model.set({'display_name': null});
        }
      , error: function(){
          this.el.replaceWith(_.template(errortmpl, {}));
        }
      , handleBlur: function(evt){
          this._focusTimeout = setTimeout(_.bind(function(){
            this.model.set({'_keep_focus': false}, {'silent': true})
            }, this), 1500);
        }
      , handleFocus: function(evt){
          if(this._focusTimeout){
            clearTimeout(this._focusTimeout);
          }
          this.model.set({'_keep_focus': true}, {'silent': true});
        }
      , handleKeyDown: function(evt){
          switch(evt.keyCode){
            case 13:
              if(! evt.altKey){
                this.submit(evt);
              }
            break;
            default:
            break;
          }
        }
      , handleScroll: function(evt){
          var clipper, scroller;
          clipper = this.el.find('div.comments-clip');
          scroller = clipper.find('ul.comments');
          // anchor if user scrolls to the bottom of the range
          if(clipper.height() + clipper.scrollTop() >= scroller.height()){
            this.model.set({'_scroll_anchored': true}, {'silent': true});
          }else{
            this.model.set({'_scroll_anchored': false}, {'silent': true});
          }
          // page back if user scrolls to the top of the range
          if(clipper.scrollTop() == 0){
            this.loading();
            $.when(this.prevPage()).then(this.loaded());
          }
        }
      , identify: function(evt){
          evt.preventDefault();
          evt.stopPropagation();
          var display_name = $('input[name=display_name]').val();
          if(display_name){
            $.ajax({
                url: '/chats/identity.json'
              , type: 'post'
              , dataType: 'json'
              , data: {
                    display_name: display_name
                }
            }).success(_.bind(function(data){
              if(data.errors){
                this.flash({type:'error', message:data.errors.join("\n")});
              }else if(data.display_name){
                this.model.set({'display_name':data.display_name, '_keep_focus': true});
              }
            }, this)
            ).error(_.bind(function(data){
              this.flash({type:'error', message:'There was an error identifying you, please try again.'});
            }, this));
          }
        }
      , loading: function(){
          this.el.addClass('loading');
        }
      , loaded: function(){
          this.el.removeClass('loading');
        }
      , flash: function(data){
          var msg = $(_.template(flashtmpl, data));
          this.el.find('form[name=new_message]').prepend(msg);
          msg.hide()
             .fadeIn()
             .delay(4000)
             .fadeOut(function(){$(this).remove()});
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
            this.collection.fetch($.extend({'add':true}, this.model.get('ajaxOptions')))
            this._timeout = setTimeout(this.poll, this.model.get('interval'));
            // trigger scroll if we opened to a blank page
            if(!this.el.children('ul.comments > li').length){
              this.el.children('.comments-clip').trigger('scroll');
            }
          }
        }
      , prevPage: function(){
          if(this.collection._oldest_seen_page){
            var dfd = $.Deferred();
            this.collection.fetch($.extend({ 'add':true,
                                             'url': this.collection._oldest_seen_page
                                           }, this.model.get('ajaxOptions')))
            return dfd.promise();
          }else{
            return true;
          }
        }
      , render: function(){
          var data = this.model.toJSON()
            , html = _.template(showtmpl)
            , identityform = _.template(identitytmpl)
            , submitform = _.template(newmessagetmpl)

          // only redraw the thread if we aren't identified...
          if(!this.el.children().length){

            this.el.append(html(data));
            // use jquery to synthesize scroll events, triggering an event
            // on an element via backbone builtin handler requires the event to bubble
            this.el.find('.comments-clip').scroll(_.bind(function(){
              this.el.trigger('chatWindow:scroll');
            }, this));
          }
          // draw the correct form
          this.el.find('form').remove();
          if(this.model.get('display_name')){
            this.el.append(submitform(data));
            $('#message_asset').uploadify(App.uploadifyOptions);
          }else{
            this.el.append(identityform(data))
          }
          // focus if focus is sticky
          if(this.model.get('_keep_focus')){
            this.el.find('textarea, input[type=text]').focus();
          }
        }
      , resume: function(){
          this.model.set({'paused': false}, {'silent': true});
          this.poll();
        }
      , submit: function(evt){
          evt.preventDefault();
          evt.stopPropagation();
          var text;
          text = this.el.find('textarea').val();
          if(text){
            message = new App.Models.Message({text: text});
            message.url = this.model.get('_submit_url');
            message.save(null, {
                success: _.bind(function(data){
                  this.el.find('textarea').val('');
                  if(!data.is_public){
                    this.flash({type: 'info', message: 'Your message is awaiting moderation.'});
                  }else{
                    // fast-poll 'til the message comes back down
                    this.model.set({interval:500}, {'slient': true});
                  }
                  this.poll();
                }, this)
              , error: _.bind(function(){
                  this.flash({type: 'error', message: 'There was a problem posting your message.'});
                }, this)
            });
          }
        }
    });
});