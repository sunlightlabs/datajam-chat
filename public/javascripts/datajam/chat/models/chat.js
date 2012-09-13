/*jshint laxcomma:true, evil:true, expr:true */
(function(define, require){
  define(['chat/init'], function(){
    var $ = jQuery
      , App = Datajam.Chat
      ;

      App.models.Chat = Backbone.Model.extend({
          defaults: {
              'ajaxOptions': {
                  cache: ($.browser.msie) ? false : true
              }
          }
        , initialize: function(){}
        , isNew: function(){
          return false;
        }
        , parse: function(data){
            var model;
            model = data.chat;
            try{
              model._newest_seen_page = '/chats/' + data.chat._id + '/pages/' + data.page._id + '.json';
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
