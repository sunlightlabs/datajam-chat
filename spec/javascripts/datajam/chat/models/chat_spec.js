(function($){
  curl(['chat/models/chat'], function(){
    describe('Chat model', function(){
      var _this = this
        , app = Datajam.Chat;

      beforeEach(function(){
        _this.server = sinon.fakeServer.create();
        _this.chat = new App.Models.Chat();
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

        it('tracks the previous page correctly', function(){
          expect(_this.chat.get('_oldest_seen_page')).toEqual('/chats/1/pages/1.json');
        });

        it('tracks the next page correctly', function(){
          expect(_this.chat.get('_newest_seen_page')).toEqual('/chats/1/pages/2.json');
        });

        it('sets the submit url correctly', function(){
          expect(_this.chat.get('_submit_url')).toEqual('/chats/1/messages.json');
        });

      });
    });
  });
})(jQuery);
