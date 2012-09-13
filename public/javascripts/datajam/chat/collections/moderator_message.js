/*jshint laxcomma:true, evil:true, expr:true */
(function(define, require){
  define(['chat/init'], function(){

    var $ = jQuery
      , App = Datajam.Chat
      ;

      App.collections.ModeratorMessage = Backbone.Collection.extend({
          comparator: function(obj){
            return Date.parse(obj.get('updated_at'));
          }
        , parse: function(resp, xhr) {
            return resp.messages;
          }
      });

  });
})(define, require);
