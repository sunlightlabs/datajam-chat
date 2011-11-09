define('views/message', [
    'text!templates/message/show.html'
  , 'common'
  , 'models/message' ], function(showtmpl){

  var $ = jQuery
    , App = DJ.Chat
    ;

    App.Views.Message = Backbone.View.extend({
        events: {}
      , initialize: function(args){
          _.bindAll(this, 'render');

          this.el = args.el;
          this.model || (this.model = new App.Models.Message);
          this.model.bind('change', this.render);
          this._anchored = args._anchored;
          this.render();
        }
      , render: function(){
          var data = this.model.toJSON()
            // this is bad:
            , container = $(this.el.replace('>li', ''))
            , anchor = null;
          data.text = this._strip_tags(data.text);
          data.text = this._linkify(data.text);
          data.text = this._imgify(data.text);
          data.text = this._spaceify(data.text);
          data.text = this._linebreaks(data.text);
          // placement is kind of dirty when you don't redraw the whole thread each time
          if(data.updated_at < container.find('li:last').attr('data-timestamp')){
            anchor = container.find('li:first');
            container.find('li').each(function(){
              if(data.updated_at < $(this).attr('data-timestamp')){
                $(this).before(_.template(showtmpl, data));
                return false;
              }
            });
          }else{
            $(_.template(showtmpl, data)).appendTo(container);
          }
          if(anchor && !this._anchored){
            container.parent().scrollTo(anchor);
          }
        }
      , _imgify: function(text){
          var html = $('<div>' + text + '</div>');
          html.find('a').each(function(){
            if($(this).html().match(/\.(jpe?g|gif|png|bmp|tiff?)$/)){
              $(this).html('<img src="' + $(this).html() + '" />');
            }
          });
          return html.html();
        }
      , _linebreaks: function(text){
          return text.replace(/\n/g, '<br>');
        }
      , _linkify: function(text){
          var linkP = /https?:\/\/[\w-\/#\.%\?=&:,|]+[\w-\/#=&]/g;
          var text = text.replace(linkP, function(match,offset){return match.link(match)});
          return text.replace('<a ', '<a target="_blank" ');
        }
      , _spaceify: function(text){
          return text.replace(/(\s)\s/g, '$1&nbsp;')
        }
      , _strip_tags: function(text){
          return $('<div>' + text + '</div>').text();
        }

    });

});