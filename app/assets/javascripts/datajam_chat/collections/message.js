define('collections/message', ['common'], function(){
  var $ = jQuery
    , App = DJ.Chat
    ;

    App.Collections.Message = Backbone.Collection.extend({
        add: function(models, options){
          if(_.isArray(models)){
            $.each(models, _.bind(function(idx, model){
              model = this._clean(model);
              if(!this.get(model.id))
                this._add(model, options);
            }, this));
          }else{
            models = this._clean(models);
            if(!this.get(models.id))
              this._add(models, options);
          }
          return this;
        }
      , comparator: function(obj){
          return Date.parse(obj.get('updated_at'));
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
          return resp.page.messages;
        }
      , _clean: function(model) {
          model.id = model._id;
          delete model._id;
          return model;
        }
    });

});