(function($){
  curl(['chat/models/moderator_chat'], function(){
    var _this = this
      , app = Datajam.Chat;

    describe('ModeratorChat model', function(){

      beforeEach(function(){
        _this.server = sinon.fakeServer.create();
        _this.chat = new app.Models.ModeratorChat;
      });

      afterEach(function(){
        _this.server.restore();
      });

      describe('on success', function(){

        beforeEach(function(){
          _this.url = '/chats/1.json';
          _this.server.respondWith('GET', _this.url, TestResponses.chat.open);
          _this.chat.url = _this.url;
          _this.chat.fetch();
          _this.server.respond();
        });

        it('sets its ID correctly', function(){
          expect(_this.chat.id).toEqual('1');
        });

        it('sets the submit url correctly', function(){
          expect(_this.chat.get('_submit_url')).toEqual('/chats/1/messages.json')
        });

      });

    });
  });
})(jQuery);
