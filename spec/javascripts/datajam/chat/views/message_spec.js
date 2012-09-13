(function($){
  require(['chat/views/message'], function(){
    describe('Message view', function(){
      var _this = this
        , app = _.extend({}, Datajam.Chat);

      beforeEach(function(){
        _this.view = new app.views.Message({el: $('<li></li>')});
        _this.view.model = new app.models.Message(Fixtures.message.approved);
        _this.view.model.url = '/chats/1/messages/1.json';
        _this.view.parentModel = function(){
          var model = new app.models.Chat({is_admin: true});
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

      it('renders with the correct timestamp', function(){
        expect(_this.view.$el.find('time').text()).toEqual('Jan 23rd, 10:42 pm');
      });

      it('activates links', function(){
        expect(_this.view.$el.find('.liveComment p').html()).toContain('href="http://link.com"');
      });

      it('embeds images', function(){
        expect(_this.view.$el.find('.liveComment p').html()).toContain('<img src="http://link.com/image.png"');
      });

      it('strips tags', function(){
        expect(_this.view.$el.find('.liveComment p').html()).not.toContain('<em>');
      });

      it('preserves whitespace with non-breaking spaces', function(){
        expect(_this.view.$el.find('.liveComment p').html()).toContain('&nbsp;');
      });

      it('converts newlines to break tags', function(){
        expect(_this.view.$el.find('.liveComment p').html()).toContain('<br');
      });

      it('can be tweeted', function(){
        var text = _this.view.$el.find('.tweet').attr('href');
        var tweetText = unescape(text.match(/.+text=(.+)/)[1]);
        expect(tweetText.length).toBeLessThan(140);
      });

      describe('when the user is not an admin', function(){

        beforeEach(function(){
          _this.server = sinon.fakeServer.create();
          _this.view.model.url = '/chats/1/messages/1.json';
          _this.view.parentModel = function(){
            var model = new app.models.Chat({is_admin: false, url: _this.view.model.url});
            model.url = _this.view.model.url;
            model.collection = new Backbone.Collection();
            return model;
          };
        });

        afterEach(function(){
          _this.server.restore();
        });

        it('can\'t be deleted', function(){
          _this.server.respondWith('POST', _this.view.model.url, TestResponses.message.destroy);
          window._confirm = window.confirm;
          window.confirm = function(){ return true; };
          sinon.spy(window, 'confirm');
          _this.view['delete'](new $.Event('click'));
          _this.server.respond();
          expect(window.confirm).not.toHaveBeenCalled();
          expect(_this.view.model.get('text')).not.toEqual('[deleted]');
          window.confirm.restore();
          window.confirm = window._confirm;
        });

        it('can\'t be edited', function(){
          _this.server.respondWith('POST', _this.view.model.url, TestResponses.message.edit);
          window._prompt = window.prompt;
          window.prompt = function(){ return 'ahh, this text is much shorter!'; };
          sinon.spy(window, 'prompt');
          _this.view.edit(new $.Event('click'));
          _this.server.respond();
          expect(window.prompt).not.toHaveBeenCalled();
          expect(_this.view.model.get('text')).not.toEqual('ahh, this text is much shorter!');
          window.prompt.restore();
          window.prompt = window._prompt;
        });

      });

      describe('when the user is an admin', function(){

        beforeEach(function(){
          _this.server = sinon.fakeServer.create();
          _this.view.model.url = '/chats/1/messages/1.json';
          _this.view.$el.wrap('<div class="datajamChatAdmin"></div>');
          _this.view.parentModel = function(){
            var model = new app.models.Chat({is_admin: true, url: _this.view.model.url});
            model.url = _this.view.model.url;
            model.collection = new Backbone.Collection();
            return model;
          };
        });

        afterEach(function(){
          _this.server.restore();
        });

        it('can be deleted', function(){
          _this.server.respondWith('POST', _this.view.model.url, TestResponses.message.destroy);
          window._confirm = window.confirm;
          window.confirm = function(){ return true; };
          sinon.spy(window, 'confirm');
          _this.view['delete'](new $.Event('click'));
          _this.server.respond();
          expect(window.confirm).toHaveBeenCalled();
          expect(_this.view.model.get('text')).toEqual('[deleted]');
          window.confirm.restore();
          window.confirm = window._confirm;
        });

        it('can be edited', function(){
          _this.server.respondWith('POST', _this.view.model.url, TestResponses.message.edit);
          window._prompt = window.prompt;
          window.prompt = function(){ return 'ahh, this text is much shorter!'; };
          sinon.spy(window, 'prompt');
          _this.view.edit(new $.Event('click'));
          _this.server.respond();
          expect(window.prompt).toHaveBeenCalled();
          expect(_this.view.model.get('text')).toEqual('ahh, this text is much shorter!');
          window.prompt.restore();
          window.prompt = window._prompt;
        });

      });

    });

  });
})(jQuery);
