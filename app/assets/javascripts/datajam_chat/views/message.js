define('views/message', [
    'text!templates/message/show.html'
  , 'common'
  , 'vendor/md5'
  , 'models/message' ], function(showtmpl){

  var $ = jQuery
    , App = DJ.Chat
    ;

    App.Views.Message = Backbone.View.extend({
        linkP: /https?:\/\/[\w\-\/#\.%\?=&:,|]+[\w\-\/#=&]/g
      , imageP: /\.(jpe?g|gif|png|bmp|tiff?)$/
      , events: {}
      , tagName: 'li'
      , initialize: function(args){
          _.bindAll(this, 'getLinks', 'getImages', 'render');

          this.model || (this.model = new App.Models.Message);
          this.model.bind('change', this.render);
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
      , render: function(){
          var data = this.model.toJSON();

          data.text = this._strip_tags(data.text);
          data.text = this._linkify(data.text);
          data.text = this._imgify(data.text);
          data.text = this._spaceify(data.text);
          data.text = this._linebreaks(data.text);
          this.el = $(this.el).replaceWith(_.template(showtmpl, data));
          return this;
        }
      , _imgify: function(text){
          var html = $('<div>' + text + '</div>')
            , imageP = this.imageP;
          html.find('a').each(function(){
            if($(this).text().search(imageP)){
              $(this).html('<img src="' + $(this).html() + '" />');
            }
          });
          return html.html();
        }
      , _linebreaks: function(text){
          return text.replace(/\n/g, '<br>');
        }
      , _linkify: function(text){
          var text = text.replace(this.linkP, function(match,offset){return match.link(match)});
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