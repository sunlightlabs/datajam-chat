(function(define, require){
  define(['chat/common'], function(){
    var $ = jQuery
      , App = Datajam.Chat
      ;

      App.Models.Chat = Backbone.Model.extend({
          defaults: {
              'ajaxOptions': {
                  cache: ($.browser.msie) ? false : true
              }
          }
        , initialize: function(){}
        , parse: function(data){
            var model;
            data.chat.id = data.chat._id;
            delete data.chat._id;
            model = data.chat;
            try{
              model._newest_seen_page = '/chats/' + data.chat.id + '/pages/' + data.page._id + '.json';
              model._oldest_seen_page = data.page.prev_page || model._newest_seen_page;
            }catch(e){
              model._newest_seen_page = null;
              model._oldest_seen_page = null;
            }
            model._submit_url = this.url.replace('.json', '/messages.json');
            return model;
          }

      });
  });
})(define, require);
