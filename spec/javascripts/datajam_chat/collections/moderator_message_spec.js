(function($){
  curl(['chat/collections/moderator_message'], function(){
    describe('ModeratorMessage collection', function(){
      var _this = this
        , app = Datajam.Chat;

      beforeEach(function(){
        _this.server = sinon.fakeServer.create();
        _this.url = '/chats/1/pages/2.json?status=incoming';
        _this.server.respondWith('GET', _this.url, TestResponses.chat.moderator);
        _this.collection = new app.Collections.ModeratorMessage;
        _this.collection.url = _this.url;
        _this.collection.model = app.Models.Message;
        _this.collection.fetch({add: true});
        _this.server.respond();
      });

      afterEach(function(){
        _this.server.restore();
      });

      it('sets model IDs correctly on parse', function(){
        expect(_this.collection.get('4f1de2399e0d520008000001')).toBeTruthy();
      });

      it('sorts messages correctly', function(){
        expect(_this.collection.first().id).toEqual('4f1de2399e0d520008000001');
        expect(_this.collection.last().id).toEqual('4f33e37c7c094f0007000001');
      });
    });
  });
})(jQuery);
