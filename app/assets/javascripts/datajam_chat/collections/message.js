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
          return obj.updated_at;
        }
      , parse: function(resp, xhr) {
          // if we are on the oldest seen page, bump it back one
          if(this._oldest_seen_page && this._oldest_seen_page.match(resp.page._id)){
            this._oldest_seen_page = resp.page.prev_page;
          }else{
            resp.page.next_page && (this.url = resp.page.next_page);
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