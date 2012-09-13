/*jshint laxcomma:true, evil:true, expr:true */
(function(define, require){
  define([
      'text!chat/templates/chat/controls.html'
    , 'chat/init'
    , 'chat/models/chat' ], function(controlstmpl){

    var $ = jQuery
      , App = Datajam.Chat
      ;

      App.views.ChatControls = Backbone.View.extend({
          events: {
              "change select": "submit"
          }
        , initialize: function(){
            _.bindAll(this, 'submit'
                          , 'render'
                          );
            this.$el.data('chat-controls', this);
            this.statuses = [
                {is_open: false, is_archived: false}
              , {is_open: true, is_archived: false}
              , {is_open: false, is_archived: true}
            ];
            try{
              var modal = this.$el.parents('.modal')
                , areaId = modal.attr('id').replace('modal-', '');
              this.model = $('#chat_area_' + areaId).data('chat').model;
              return this.render();
            }catch(e){
              Datajam.debug('Caught `' + e + '` initializing controls, no model associated.');
              return this;
            }
          }
        , render: function(){
            this.$el.html(controlstmpl);
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
            val && this.$el.find('select').val(val);
            return this;
          }
        , submit: function(){
            console.log(this.model.isNew());
            var select = this.$el.find('select')
              , idx = (select.length) ? (select.first().val()) : null;
            idx && this.model.save(this.statuses[idx-1]);
            return this;
          }
      });
  });
})(define, require);