define('models/moderator_chat', ['common'], function(){
  var $ = jQuery
    , App = DJ.Chat
    ;

    App.Models.ModeratorChat = Backbone.Model.extend({
        defaults: {}
      , initialize: function(){}
      , parse: function(data){
          var model;
          data.chat.id = data.chat._id;
          delete data.chat._id;
          model = data.chat;
          model._submit_url = this.url.replace('.json', '/messages/');
          return model;
        }

    });

});