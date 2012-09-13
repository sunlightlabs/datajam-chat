(function($){
  require(['chat/views/incoming_message'], function(){
    describe('IncomingMessage view', function(){
      var _this = this
        , app = _.extend({}, Datajam.Chat);

      beforeEach(function(){
        _this.view = new app.views.IncomingMessage({el: $('<li></li>')});
        _this.view.model = new app.models.Message(Fixtures.message.incoming);
        _this.view.model.url = '/chats/1/messages/1.json';
        _this.view.parentModel = function(){
          var model = new app.models.ModeratorChat({is_admin: true});
          model.url = _this.view.model.url;
          model.collection = new Backbone.Collection();
          return model;
        };
        _this.view.render();
        _this.server = sinon.fakeServer.create();
        _this.server.respondWith(TestResponses.message.create);
      });

      afterEach(function(){
        _this.server.restore();
      });

      it('can be approved', function(){
        _this.view.approve(new $.Event('click'));
        _this.server.respond();
        expect(_this.view.model.get('is_public')).toBeTruthy();
      });

      it('can be rejected', function(){
        _this.view.reject(new $.Event('click'));
        _this.server.respond();
        expect(_this.view.model.get('is_moderated')).toBeTruthy();
      });

    });
  });
})(jQuery);