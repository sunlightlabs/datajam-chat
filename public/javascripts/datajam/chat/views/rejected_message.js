(function(define, require){
  define([
      'text!chat/templates/message/rejected.html'
    , 'chat/common'
    , 'chat/views/message'
    , 'chat/models/message' ], function(showtmpl){

    var $ = jQuery
      , App = Datajam.Chat
      ;

      App.Views.RejectedMessage = App.Views.Message.extend({
          className: 'message rejected'
        , events: {
              "click .approve": "approve"
            , "click .deleteAttachments": "deleteAttachments"
          }
        , initialize: function(args){
            _.bindAll(this
                    , 'approve'
                    , 'deleteAttachments'
                    , 'empty'
                    , 'getImages'
                    , 'getLinks'
                    , 'loading'
                    , 'parentModel'
                    , 'parentView'
                    , 'render'
                    , '_url');

            this.model || (this.model = new App.Models.Message());
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
        , deleteAttachments: function(evt){
            evt.preventDefault();
            var urls = this.getImages()
              , filenames = [];
            _(urls).each(function(url, idx){
              filenames.push(_.last(url.split('/')));
            });
            filenames = _(filenames).compact();
            if(filenames.length){
              $.ajax({
                  url: '/chats/upload.json'
                , type: 'POST'
                , dataType: 'json'
                , data: {
                      _method: 'delete'
                    , filenames: filenames
                  }
                , success: _.bind(function(response){
                    if(response){
                      var text = this.model.get('text');
                      _(urls).each(function(url, idx){
                        text = text.replace(url, '');
                      });
                      this.model.url = this._url();
                      this.model.set({text: text});
                      this.model.save();
                    }
                  }, this)
              });
            }
          }
        , empty: function(){
            $(this.el).html('');
          }
        , loading: function(){
            $(this.el).addClass('loading');
          }
        , render: function(){
            var data = this.model.toJSON()
              , parent_model = this.parentModel();
            data.text = this._strip_tags(data.text);
            data.text = this._linkify(data.text);
            data.text = this._imgify(data.text);
            data.text = this._spaceify(data.text);
            data.text = this._linebreaks(data.text);
            // set up the container element because replacing it is too painful
            $(this.el).attr('id', 'message_' + data.id)
                      .attr('data-timestamp', data.updated_at);
            if(parent_model && parent_model.get('is_admin')) $(this.el).addClass('sunlight');
            $(this.el).html(_.template(showtmpl, data));
            this.delegateEvents();
            return this;
          }
      });

  });
})(define, require);