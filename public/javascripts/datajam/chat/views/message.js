/*jshint laxcomma:true, evil:true, expr:true */
(function(define, require){
  define([
      'text!chat/templates/message/show.html'
    , 'chat/init'
    , 'chat/libs/md5'
    , 'chat/models/message' ], function(showtmpl){

    var $ = jQuery
      , App = Datajam.Chat
      ;

      App.views.Message = Backbone.View.extend({
          linkP: /https?:\/\/[\w\-\/#\.%\?\+\~\!\|=&:,|]+[\w\-\/#=&]/g
        , imageP: /\.(jpe?g|gif|png|bmp|tiff?)$/
        , events: {
              'click .edit': 'edit'
            , 'click .delete': 'delete'
          }
        , tagName: 'li'
        , className: 'message clearfix'
        , initialize: function(args){
            _.bindAll(this
                    , 'delete'
                    , 'edit'
                    , 'getLinks'
                    , 'getImages'
                    , 'parentModel'
                    , 'parentView'
                    , 'render'
                    , '_imgify'
                    , '_linkify'
                    , '_url'
                    );

            this.model || (this.model = new App.models.Message());
            this.model.bind('change', this.render);
          }
        , 'delete': function(evt){
            evt.preventDefault();
            var parent_model = this.parentModel();
            if(parent_model && parent_model.get('is_admin') && this.$el.parents('.datajamChatAdmin').length){
              Datajam.debug('deleting');
              if(confirm('Really delete this comment?')){
                this.model.url = this._url();
                this.model.set({text: App.constants.deleted_message_text});
                this.model.save().success(_.bind(function(){
                  parent_model.collection.remove(this.model);
                }, this));
              }
            }
          }
        , edit: function(evt){
            var parent_model = this.parentModel();
            Datajam.debug(parent_model);
            if(parent_model && parent_model.get('is_admin') && this.$el.parents('.datajamChatAdmin').length){
              evt.preventDefault();
              $(evt.target).parent('.commentDetails').nextAll('.liveComment').find('p').eq(0)
                .attr('contenteditable', true).blur(_.bind(function(evt){
                  var elem = $(evt.target),
                      html = elem.html();
                  // convert divs to newlines
                  html = html.replace(/<(?:div|br) ?\/?>/g, "\r\n")
                             .replace("</div>", "");
                  // strip other html
                  text = $('<div>' + html + '</div>').text();
                  elem.attr('contenteditable', false);
                  Datajam.debug(text);
                  if(text && text != this.model.get('text')){
                    this.model.url = this._url();
                    this.model.set({text: text});
                    this.model.save().success(_.bind(function(){
                      // unbind the blur event
                      elem.unbind('blur');
                      // delete if deleted
                      if(text == App.constants.deleted_message_text){
                        parent_model.collection.remove(this.model);
                      }
                    }, this));
                  }
                }, this));
            }
          }
        , getLinks: function(){
            return this.model.get('text').match(this.linkP);
          }
        , getImages: function(){
            var links = this.getLinks();
            return _(links).filter(_.bind(function(link){
              return link.search(this.imageP);
            }, this));
          }
        , parentModel: function(){
            return (this.parentView() && this.parentView().model) || null;
          }
        , parentView: function(){
            // gets the chat that this message belongs to
            return this.$el.parents('.datajamChatThread').data('chat') || null;
          }
        , render: function(){
            var data = this.model.toJSON()
              , parent_model = this.parentModel();
            data.text = _(data.text).chain()
              .striptags()
              .linkify(this.linkP)
              .imgify(this.imageP)
              .spaceify()
              .linebreaks()
              .value();
            // set up the container element because replacing it is too painful
            this.$el.attr('id', 'message_' + data._id)
                      .attr('data-timestamp', data.updated_at);
            if(parent_model && parent_model.get('is_admin')) this.$el.addClass('sunlight');
            this.$el.html(_.template(showtmpl, data));
            this.delegateEvents();
            return this;
          }
        , _imgify: function(text){
            var html = $('<div>' + text + '</div>')
              , imageP = this.imageP;
            html.find('a').each(function(){
              if($(this).text().search(imageP) > -1){
                $(this).html('<img src="' + $(this).html() + '" />');
              }
            });
            return html.html();
          }
        , _linebreaks: function(text){
            return text.replace(/\n/g, '<br>');
          }
        , _linkify: function(text){
            text = text.replace(this.linkP, function(match,offset){return match.link(match);});
            return text.replace('<a ', '<a target="_blank" ');
          }
        , _spaceify: function(text){
            return text.replace(/(\s)\s/g, '$1&nbsp;');
          }
        , _strip_tags: function(text){
            return $('<div>' + text + '</div>').text();
          }
        , _url: function(){
            return this.parentModel().url.replace(/\.json*/, '/messages/' + this.model.id + '.json');
          }
      });

  });
})(define, require);