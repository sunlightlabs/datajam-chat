(function($){
  curl(['chat/views/chat_controls'], function(){
    describe('ChatControls view', function(){
      var _this = this
        , app = _.extend({}, Datajam.Chat);

      beforeEach(function(){
        _this.url = '/chats/1.json';
        _this.server = sinon.fakeServer.create();
        _this.server.respondWith('GET', _this.url, TestResponses.chat.open);
        _this.view = new app.Views.ChatControls({ el: $('<div></div>') });
        _this.model = new app.Models.Chat;
        _this.model.url = _this.url;
        _this.view.model = _this.model;
        _this.view.render();
      });

      afterEach(function(){
        _this.server.restore();
      });

      it('renders with the correct status selected', function(){
        expect(_this.view.el.find('select').val()).toEqual('1');
        _this.view.model.fetch();
        _this.server.respond();
        _this.view.render();
        expect(_this.view.el.find('select').val()).toEqual('2');
      });

      it('changes the status of the chat when changed', function(){
        _this.view.model.fetch();
        _this.server.respond();
        _this.view.render();

        sinon.stub(_this.model, 'save');
        _this.view.el.find('select').val(3).change();
        expect(_this.model.save).toHaveBeenCalledWith({is_archived: true, is_open: false}, {data: {is_archived: true, is_open: false}});
        _this.model.save.restore();
      });

    });
  });
})(jQuery);