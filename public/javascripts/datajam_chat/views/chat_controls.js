(function(define, require){
  define([
      'text!chat/templates/chat/controls.html'
    , 'chat/common'
    , 'chat/models/chat' ], function(controlstmpl){

    var $ = jQuery
      , App = Datajam.Chat
      ;

      App.Views.ChatControls = Backbone.View.extend({
          events: {
              "change select": "submit"
          }
        , initialize: function(){
            _.bindAll(this, 'submit'
                          , 'render'
                          );
            this.el.data('chat-controls', this);
            this.statuses = [
                {is_open: false, is_archived: false}
              , {is_open: true, is_archived: false}
              , {is_open: false, is_archived: true}
            ]
            var modal = this.el.parents('.modal')
              , areaId = modal.attr('id').replace('modal-', '');
            try{
              this.model = $('#chat_area_' + areaId).data('chat').model;
            }catch(e){
              return;
            }
            return this.render();
          }
        , render: function(){
            this.el.html(controlstmpl);
            var status = {
                    is_open: this.model.get('is_open')
                  , is_archived: this.model.get('is_archived')
                }
              , val = null;
            _(this.statuses).each(function(obj, idx, statuses){
              if(_.isEqual(obj, status)){
                val = idx + 1;
              }
            }, this);
            val && this.el.find('select').val(val);
            return this;
          }
        , submit: function(){
            var select = this.el.find('select')
              , idx = (select.length) ? (select.first().val()) : null;
            idx && this.model.save(this.statuses[idx-1], {data: this.statuses[idx-1]});
          }
      });
  });
})(curl.define, curl);