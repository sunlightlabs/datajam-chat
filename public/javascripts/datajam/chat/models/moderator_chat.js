(function(define, require){
  define(['chat/common'], function(){
    var $ = jQuery
      , App = Datajam.Chat
      ;

      App.Models.ModeratorChat = Backbone.Model.extend({
          defaults: {}
        , initialize: function(){}
        , parse: function(data){
            var model;
            data.chat.id = data.chat._id;
            delete data.chat._id;
            model = data.chat;
            model._submit_url = this.url.replace('.json', '/messages.json');
            return model;
          }

      });

  });
})(curl.define, curl);