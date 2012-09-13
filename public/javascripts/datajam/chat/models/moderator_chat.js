/*jshint laxcomma:true, evil:true, expr:true */
(function(define, require){
  define(['chat/init'], function(){
    var $ = jQuery
      , App = Datajam.Chat
      ;

      App.models.ModeratorChat = Backbone.Model.extend({
          defaults: {}
        , initialize: function(){}
        , isNew: function(){
          return false;
        }
        , parse: function(data){
            var model;
            model = data.chat;
            model._submit_url = this.url.replace('.json', '/messages.json');
            return model;
          }

      });

  });
})(define, require);