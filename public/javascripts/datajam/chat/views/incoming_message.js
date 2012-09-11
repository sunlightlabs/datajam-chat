(function(define, require){
  define([
      'text!chat/templates/message/incoming.html'
    , 'chat/common'
    , 'chat/views/message'
    , 'chat/models/message' ], function(showtmpl){

    var $ = jQuery
      , App = Datajam.Chat
      ;

      App.Views.IncomingMessage = App.Views.Message.extend({
          events: {
              "click .approve": "approve"
            , "click .reject": "reject"
          }
        , initialize: function(args){
            _.bindAll(this
                    , 'approve'
                    , 'empty'
                    , 'getImages'
                    , 'getLinks'
                    , 'loading'
                    , 'parentModel'
                    , 'parentView'
                    , 'reject'
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