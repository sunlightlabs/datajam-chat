define('models/chat', ['common'], function(){
  var $ = jQuery
    , App = DJ.Chat
    ;

    App.Models.Chat = Backbone.Model.extend({
        defaults: {}
      , initialize: function(){}
      , parse: function(data){
          var model;
          data.chat.id = data.chat._id;
          delete data.chat._id;
          model = data.chat;
          model._newest_seen_page = '/chats/' + data.chat.id + '/chat_pages/' + data.page._id + '.json';
          model._oldest_seen_page = data.page.prev_page || model._newest_seen_page;
          model._submit_url = this.url.replace('.json', '/messages.json');
          return model;
        }

    });

});