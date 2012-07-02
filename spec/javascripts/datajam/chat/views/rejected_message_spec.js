(function($){
  curl(['chat/views/rejected_message'], function(){
    describe('RejectedMessage view', function(){
      var _this = this
        , app = Datajam.Chat;

      beforeEach(function(){
        _this.view = new app.Views.RejectedMessage({el: $('<li></li>')})
        _this.view.model = new app.Models.Message(Fixtures.message.rejected);
        _this.view.model.url = '/chats/1/messages/1.json';
        _this.view.parentModel = function(){
          var model = new app.Models.Chat({is_admin: true});
          model.url = _this.view.model.url;
          model.collection = new Backbone.Collection;
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

    });
  });
})(jQuery);