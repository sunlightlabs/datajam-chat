(function(define, require){
  define(['chat/common'], function(){
    var $ = jQuery
      , App = Datajam.Chat
      ;

      App.Collections.Message = Backbone.Collection.extend({
          add: function(models, options){
            if(_.isArray(models)){
              $.each(models, _.bind(function(idx, model){
                model = this._clean(model);
                this.handle_message(model, options);
              }, this));
            }else{
              models = this._clean(models);
              this.handle_message(model, options);
            }
            return this;
          }
        , handle_message: function(model, options){
            var existing = this.get(model.id);
            if(!existing){
              if(model.text){
                this._add(model, options);
              }
            }else if(model.updated_at > existing.get('updated_at')){
              if(model.text){
                existing.set(model);
              }else{
                this.remove(existing);
              }
            }
          }
        , comparator: function(obj){
            return 0 - Date.parse(obj.get('updated_at')).valueOf();
          }
        , parse: function(resp, xhr) {
            var page = '/chats/' + resp.chat._id + '/pages/' + resp.page._id + '.json';
            // if we are on the oldest seen page, bump it back one;
            // otherwise if there's a newer page, set it forward.
            if(page == this._oldest_seen_page){
              this._oldest_seen_page = resp.page.prev_page;
            }else if(page == this._newest_seen_page){
              if(resp.page.next_page){
                this.url = resp.page.next_page;
                this._newest_seen_page = resp.page.next_page;
              }
            }
            // Separation of concerns (n). Not this.
            if(!resp.chat.is_open && !_.isEqual(resp.chat, this.view.model.toJSON())){
              this.view.model.set(resp.chat);
              this.view.pause();
            }
            return resp.page.messages;
          }
        , _clean: function(model) {
            model.id = model._id;
            delete model._id;
            return model;
          }
      });
  });
})(curl.define, curl);
