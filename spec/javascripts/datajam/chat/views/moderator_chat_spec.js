(function($){
  require(['chat/views/moderator_chat'], function(){
    describe('ModeratorChat view', function(){
      var _this = this
        , app = Datajam.Chat;

      beforeEach(function(){
        _this.url = '/chats/1.json';
        _this.messagesUrl = '/chats/1/messages.json'
        _this.server = sinon.fakeServer.create();
        _this.server.respondWith('GET', _this.url, TestResponses.chat.open);
        _this.server.respondWith('GET', _this.messagesUrl + '?status=incoming', TestResponses.chat.moderator);
        _this.view = new app.views.ModeratorChat({ el: $('<div class="moderator" data-url="' + _this.url + '" data-interval="3000" data-status="incoming"></div>') });
      });

      afterEach(function(){
        _this.server.restore();
        _this.view.destroy();
        _this.view=null;
      });

      it('polls for content', function(){
        sinon.stub(_this.view, 'poll');
        _this.server.respond();
        expect(_this.view.poll).toHaveBeenCalled();
        _this.view.poll.restore();
      });

      it('adds messages to the dom when the collection\'s add event fires', function(){
        _this.server.respond();
        expect(_this.view.$el.find('.comments li').length).toEqual(2);
      });

      it('displays messages of the correct status', function(){
        expect(_this.view.collection.url).toContain('?status=incoming');
      });

      it('appends messages to the dom in the right order', function(){
        _this.server.respond();
        // incoming is oldest first
        expect(_this.view.$el.find('.comments li').first().attr('id')).toEqual('message_4f1de2399e0d520008000001');
        expect(_this.view.$el.find('.comments li').last().attr('id')).toEqual('message_4f33e37c7c094f0007000001');
      });

    });
  });
})(jQuery);