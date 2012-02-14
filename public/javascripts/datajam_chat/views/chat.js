(function(define, require){
  define([
      'text!chat/templates/chat/show.html'
    , 'text!chat/templates/chat/closed.html'
    , 'text!chat/templates/chat/error.html'
    , 'text!chat/templates/chat/identity.html'
    , 'text!chat/templates/common/flash.html'
    , 'text!chat/templates/message/new.html'
    , 'chat/common'
    , 'chat/upload'
    , 'chat/models/chat'
    , 'chat/models/message'
    , 'chat/views/message'
    , 'chat/collections/message' ], function(showtmpl, closedtmpl, errortmpl, identitytmpl, flashtmpl, newmessagetmpl){

    var $ = jQuery
      , App = Datajam.Chat
      ;

      App.Views.Chat = Backbone.View.extend({
          events: {
              "submit form[name=new_message]": "submit"
            , "submit form[name=identify]": "identify"
            , "blur textarea": "handleBlur"
            , "click .destroyIdentity": "destroyIdentity"
            , "click .attachFile": "uploadDialog"
            , "change #chat_asset": "uploadFile"
            , "focus textarea": "handleFocus"
            , "keydown textarea": "handleKeyDown"
            , "chatWindow:scroll": "handleScroll"
          }
        , initialize: function(){
            //scope class methods
            _.bindAll(this, 'addMessage'
                          , 'archive'
                          , 'bootstrap'
                          , 'close'
                          , 'destroy'
                          , 'destroyIdentity'
                          , 'disableSubmit'
                          , 'enableSubmit'
                          , 'error'
                          , 'handleBlur'
                          , 'handleChange'
                          , 'handleFocus'
                          , 'handleKeyDown'
                          , 'handleScroll'
                          , 'identify'
                          , 'loading'
                          , 'loaded'
                          , 'open'
                          , 'pause'
                          , 'pollForContent'
                          , 'pollForOpenness'
                          , 'prevPage'
                          , 'removeMessage'
                          , 'render'
                          , 'resume'
                          , 'submit'
                          , 'uploadDialog'
                          , 'uploadFile'
                          );
            this.loading();

            this.el.data('chat', this);
            this.model = new App.Models.Chat;
            this.model.url = this.el.attr('data-url');
            this.model.set({interval: this.el.attr('data-interval'), _scroll_anchored: true });
            this.model.bind('change', this.render);
            this.model.bind('change', this.handleChange);

            // get identity if available
            $.ajax({
              'url': '/chats/identity.json',
              'dataType': 'json'
            }).success(_.bind(function(data){
              if (data.display_name){
                this.model.set({
                    'display_name': data.display_name
                  , 'is_admin': data.is_admin
                });
              }
            }, this));

            this.pollForOpenness();

          }
        , addMessage: function(model){
            var clipper = this.el.find('.commentsClip')
              , scroller = clipper.find('.comments')
              , offset = clipper.scrollTop()
              , height = scroller.height()
              , items = scroller.find('li')
              , message = new App.Views.Message({
                     model: model
                });

            // make sure the polling timeout is something sane
            this.model.set({interval:this.el.attr('data-interval')}, {'silent': true});

            // append in order
            if(items.length && this.collection.indexOf(model) < items.length){
              items.eq(this.collection.indexOf(model)).before(message.render().el)
            }else{
              scroller.append(message.render().el);
            }

            // maintain scroll offset if not anchored
            if(!this.model.get('_scroll_anchored')){
              scroller.find('img').imagesLoaded(_.bind(function(){
                var diff = scroller.height() - height;
                clipper.scrollTo(offset+ diff);
              }, this));
            }
          }
        , archive: function(model){
            Datajam.debug('archiving');
            model && this.bootstrap(model);
            model && this.pollForContent();
            this.model.set({'is_open': false, 'is_archived': true});
            this.pause();
          }
        , bootstrap: function(model){
            Datajam.debug('bootstrapping');
            if(!this.collection){
              this.collection = new App.Collections.Message;
              this.collection.bind('add', this.addMessage);
              this.collection.bind('remove', this.removeMessage);
              this.collection.ajaxOptions = model.ajaxOptions;
              this.collection.url = this.model.url.replace('.json', '/pages/' + model.page._id + '.json');
              this.collection._newest_seen_page = this.collection.url;
              this.collection._oldest_seen_page = model.page.prev_page;
              this.collection.view = this;
              this.model.collection = this.collection;
            }else{
              this.collection._oldest_seen_page = this.collection.url;
              this.collection.reset();
            }
          }
        , close: function(){
            Datajam.debug('closing');
            this.model.set({'is_open': false, 'is_archived': false});
            this.pollForOpenness();
          }
        , destroy: function(){
            this.pause();
            this.el.html('');
          }
        , destroyIdentity: function(evt){
            evt.preventDefault();
            if(this.model.get('display_name')){
              $.ajax({
                  url: '/chats/identity.json'
                , type: 'post'
                , dataType: 'json'
                , data: {display_name: this.model.get('display_name'), _method: 'delete'}
              });
            }
            this.model.set({'display_name': null});
          }
        , disableSubmit: function(){
            this.el.find('form').addClass('disabled');
          }
        , enableSubmit: function(){
            this.el.find('form').removeClass('disabled');
          }
        , error: function(){
            this.el.html(_.template(errortmpl, {}));
          }
        , flash: function(data){
            var msg = $(_.template(flashtmpl, data));
            this.el.find('form').eq(0).prepend(msg);
            msg.hide()
               .fadeIn()
               .delay(4000)
               .fadeOut(function(){$(this).remove()});
          }
        , handleBlur: function(evt){
            this._focusTimeout = setTimeout(_.bind(function(){
              this.model.set({'_keep_focus': false}, {'silent': true});
              $(evt.target).parents('.datajamChatThread').removeClass('active');
            }, this), 1500);
          }
        , handleChange: function(evt){
            Datajam.debug('model changed');
            if(!this.model.get('is_open') && !this.model.get('is_archived')){
              this.pollForOpenness();
            }
          }
        , handleFocus: function(evt){
            if(this._focusTimeout){
              clearTimeout(this._focusTimeout);
            }
            this.model.set({'_keep_focus': true}, {'silent': true});
            $(evt.target).parents('.datajamChatThread').addClass('active');
          }
        , handleKeyDown: function(evt){
            switch(evt.keyCode){
              case 13:
                if(evt.ctrlKey || evt.metaKey){
                  this.submit(evt);
                }
              break;
              default:
              break;
            }
          }
        , handleScroll: function(evt){
            var clipper, scroller;
            clipper = this.el.find('div.commentsClip');
            scroller = clipper.find('.comments');
            // anchor if user scrolls to the top of the range
            if(clipper.scrollTop() == 0){
            // if(clipper.height() + clipper.scrollTop() >= scroller.height()){
              this.model.set({'_scroll_anchored': true}, {'silent': true});
            }else{
              this.model.set({'_scroll_anchored': false}, {'silent': true});
            }
            // page back if user scrolls to the end of the range
            if(clipper.height() + clipper.scrollTop() >= scroller.height()){
              this.loading();
              $.when(this.prevPage()).then(_.bind(function(){
                  this.loaded();
                  setTimeout(_.bind(function(){
                    if(clipper.height() >= scroller.height()){
                      clipper.trigger('scroll');
                    }
                  }, this), 100);
              }, this)());
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
                  this.flash({type:'error', message:data.errors.join("<br/>")});
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
        , open: function(model){
            Datajam.debug('opening');
            this.model.set({
                  'is_open': true
                , 'is_archived': false
            });
            this.bootstrap(model);
            this.resume();
          }
        , pause: function(){
            Datajam.debug('pausing');
            this.model.set({'paused': true}, {'silent': true});
          }
        , pollForContent: function(){
            if(this._timeout){
              clearTimeout(this._timeout);
              this._timeout = null;
            }
            if(this._request){
              this._request.abort();
              this._request = null;
            }
            this._request = this.collection.fetch($.extend({'add':true}, this.model.get('ajaxOptions')))
            // trigger scroll if we opened to a blank page
            if(!this.el.children('ul.comments > li').length){
              this.el.children('.commentsClip').trigger('scroll');
            }
            if(!this.model.get('paused')){
              this._timeout = setTimeout(this.pollForContent, this.model.get('interval'));
            }
          }
        , pollForOpenness: function(){
            if(this._timeout){
              clearTimeout(this._timeout);
              this._timeout = null;
            }
            this.model.fetch()
              .success(_.bind(function(model){
                if(model.chat.is_open){
                  this.open(model);
                }
                if(model.chat.is_archived){
                  this.archive(model);
                }
                if(!model.chat.is_open && !model.chat.is_archived){
                  this.render();
                  this._timeout = setTimeout(this.pollForOpenness, this.model.get('interval'));
                }
              }, this))
              .error(this.error)
              .complete(this.loaded);
          }
        , prevPage: function(){
            Datajam.debug('prev page');
            if(this.collection._oldest_seen_page){
              var dfd = $.Deferred();
              this.collection.fetch($.extend({
                    'add':true
                  , 'url': this.collection._oldest_seen_page
                }
                , this.model.get('ajaxOptions')));
              return dfd.promise();
            }else{
              return true;
            }
          }
        , removeMessage: function(model){
            var scroller = this.el.find('.comments')
              , item = scroller.find('li#message_' + model.get('id'));
            item && item.remove();
          }
        , render: function(){
            Datajam.debug('rendering');
            var data = _(this.model.toJSON()).extend(App.csrf)
              , html = _.template(showtmpl)
              , closedmessage = _.template(closedtmpl)
              , identityform = _.template(identitytmpl)
              , submitform = _.template(newmessagetmpl)

            // if the model doesn't have an id, skip for now
            if(!data.id) return this;

            // if the model is closed, render the closed message
            if(!data.is_open && !data.is_archived){
              this.el.html(closedmessage);
              return this;
            }

            // only redraw the thread if we aren't identified...
            if(! this.el.children().not('.closed').length){
              this.el.html('');

              this.el.append(html(data));
              // use jquery to synthesize scroll events, triggering an event
              // on an element via backbone builtin handler requires the event to bubble
              this.el.find('.commentsClip').scroll(_.bind(function(){
                this.el.trigger('chatWindow:scroll');
              }, this));
            }

            // draw the correct form, if needed
            this.el.find('form, .archived').remove();
            if(data.is_open){
              if(this.model.get('display_name')){
                this.el.find('.tip').after(submitform(data));
              }else{
                this.el.find('.tip').after(identityform(data))
              }
            }else{
              this.el.find('.tip').remove();
            }
            if(data.is_archived){
              this.el.prepend('<p class="archived">This is an archived event, comments are no longer being accepted.</p>');
            }

            // focus if focus is sticky
            if(this.model.get('_keep_focus')){
              this.el.find('textarea, input[type=text]').focus();
            }
            this.delegateEvents();
            return this;
          }
        , resume: function(){
            Datajam.debug('resuming');
            this.model.set({'paused': false}, {'silent': true});
            this.pollForContent();
          }
        , submit: function(evt){
            evt.preventDefault();
            evt.stopPropagation();
            this.el.find('form textarea').eq(0).focus();
            if(this.el.find('form').eq(0).hasClass('disabled')){
              return;
            }
            var text;
            text = this.el.find('textarea').val();
            if(text){
              this.disableSubmit();
              message = new App.Models.Message({text: text});
              message.url = this.model.get('_submit_url');
              message.save(null, {
                  dataType: 'json'
                , success: _.bind(function(data){
                    this.el.find('textarea').val('');
                    if(!data.is_public){
                      this.flash({type: 'info', message: 'Your message is awaiting moderation.'});
                    }else{
                      // fast-poll 'til the message comes back down
                      this.model.set({interval:500}, {'silent': true});
                    }
                    this.pollForContent();
                  }, this)
                , error: _.bind(function(model, xhr){
                    var errors;
                    if((errors = JSON.parse(xhr.responseText).errors) && errors.text){
                      this.flash({type: 'error', message: 'Text ' + errors.text[0]});
                    }else{
                      this.flash({type: 'error', message: 'There was a problem posting your message.'});
                    }
                  }, this)
                , complete: this.enableSubmit
              });
            }
          }
        , uploadDialog: function(evt){
            evt.preventDefault();
            $($(evt.target).attr('href')).trigger('click');
          }
        , uploadFile: function(evt){
            if($(evt.target).val()){
              $(evt.target).parents('form')
                .ajaxSubmit({
                    dataType: 'json'
                  , success: _.bind(function(response){
                      // iframe transport w/ jquery.form doesn't seem to be aware of status codes.
                      // so, we check for a url attribute to know if it worked.
                      if(response && response.url){
                        var textarea = $(evt.target).parents('.inputArea').find('textarea');
                        textarea.val(textarea.val() + location.protocol + '//' + location.host + response.url);
                        $(evt.target).val('');
                        textarea.focus();
                      }else{
                        this.flash({type:'error', message:'Upload failed. Accepted file types are png, jpg, gif.'});
                      }
                    }, this)
                });
            };
          }
      });
  });
})(curl.define, curl);