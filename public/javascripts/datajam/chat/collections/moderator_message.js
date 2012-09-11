(function(define, require){
  define(['chat/common'], function(){

    var $ = jQuery
      , App = Datajam.Chat
      ;

      App.Collections.ModeratorMessage = Backbone.Collection.extend({
          comparator: function(obj){
            return Date.parse(obj.get('updated_at'));
          }
        , parse: function(resp, xhr) {
            _(resp.messages).each(function(message, idx){
              resp.messages[idx].id = message._id;
              delete resp.messages[idx]['_id'];
            });
            return resp.messages;
          }
      });

  });
})(define, require);
