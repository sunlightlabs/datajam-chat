(function($){
  curl(['chat/views/chat'], function(){
    describe('Chat view', function(){
      var _this = this
        , app = _.extend({}, Datajam.Chat);

      beforeEach(function(){
        _this.url = '/chats/1.json';
        _this.pageUrl = '/chats/1/pages/2.json';
        _this.server = sinon.fakeServer.create();
        _this.server.respondWith('GET', _this.url, TestResponses.chat.closed);
        _this.view = new app.Views.Chat({ el: $('<div data-url="' + _this.url + '" data-interval="3000"></div>') });
      });

      afterEach(function(){
        _this.view.destroy();
        _this.view = null;
        _this.server.restore();
      });

      it('destroys itself correctly', function(){
        _this.server.respond();
        var el = _this.view.el;
        expect(el.find('div.closed').length).toBeTruthy();
        _this.view.destroy();
        expect(el.html()).toBeFalsy();
      });

      it('alerts the user when a bootstrap error is encountered', function(){
        _this.server.responses = []
        _this.server.respondWith('GET', _this.url, TestResponses.chat.error);
        _this.server.respond();
        expect(_this.view.el.find('div.crashed').length).toBeTruthy;
      });

      describe('when live chat has not yet started', function(){

        it('polls for openness', function(){
          _this.view.model.set({_interval:1},{silent:true});
          sinon.stub(_this.view, 'pollForOpenness');
          _this.server.respond();
          expect(_this.view.pollForOpenness).toHaveBeenCalled();
          _this.view.pollForOpenness.restore();
        });

        it('opens itself correctly', function(){
          var el = _this.view.el;
          console.log(el);
          _this.server.respond();
          expect(el.find('div.closed').length).toBeTruthy();
          _this.server.responses = [];
          _this.server.respondWith('GET', _this.url, TestResponses.chat.open);
          _this.view.pollForOpenness();
          _this.server.respond();
          expect(el.find('form').length).toBeTruthy();
        });

      });

      describe('when live chat is open', function(){

        beforeEach(function(){
          _this.server.responses = [];
          _this.server.respondWith('GET', _this.url, TestResponses.chat.open);
          _this.server.respondWith('GET', _this.pageUrl, TestResponses.page.open);
        });

        it('polls for content', function(){
          sinon.stub(_this.view, 'pollForContent');
          _this.server.respond();
          expect(_this.view.pollForContent).toHaveBeenCalled();
          _this.view.pollForContent.restore();
        })

        it('adds new messages to the dom', function(){
          _this.server.respond();
          expect(_this.view.el.find('.comments li').length).toBeTruthy();
        });

        it('appends messages to the dom in the right order', function(){
          _this.server.respond();
          // last is first, first is last
          expect(_this.view.el.find('.comments li').first().attr('id')).toEqual('message_4f1b7409340942000100001f');
          expect(_this.view.el.find('.comments li').last().attr('id')).toEqual('message_4f1b73ff340942000100001e');
        });

        it('resets the polling interval when a message is received', function(){
          _this.view.model.set({interval: '10'},{silent: true});
          _this.server.respond();
          expect(_this.view.model.get('interval')).not.toEqual('10');
        });

        it('can archive itself correctly', function(){
          _this.server.respond();
          expect(_this.view.el.find('form').length).toBeTruthy();
          _this.server.responses.pop();
          _this.server.respondWith('GET', _this.pageUrl, TestResponses.page.archived);
          _this.view.pollForContent();
          _this.server.respond();
          expect(_this.view.el.find('.archived').length).toBeTruthy();
        });

        it('can bootstrap itself correctly', function(){
          sinon.stub(_this.view, 'bootstrap');
          _this.server.respond();
          expect(_this.view.bootstrap).toHaveBeenCalled();
          _this.view.bootstrap.restore();
        });

        it('can close itself correctly', function(){
          _this.server.respond();
          expect(_this.view.el.find('form').length).toBeTruthy();
          _this.server.responses = [];
          _this.server.respondWith('GET', _this.url, TestResponses.chat.closed);
          _this.server.respondWith('GET', _this.pageUrl, TestResponses.page.closed);
          _this.view.pollForContent();
          _this.server.respond();
          expect(_this.view.el.find('.closed').length).toBeTruthy();
        });

        it('displays flash messages correctly', function(){
          _this.server.respond();
          _this.view.flash({type: 'error', message: 'hello, world!'});
          expect(_this.view.el.find('.flash').html()).toContain('hello, world!');
        });

        it('indicates when content is loading', function(){
          expect(_this.view.el.hasClass('loading')).toBeTruthy();
          _this.server.respond();
          expect(_this.view.el.hasClass('loading')).toBeFalsy();
        });

        it('pauses itself correctly', function(){
          _this.server.respond();
          expect(_this.view._timeout).toBeTruthy();
          _this.view.pause();
          _this.view.pollForContent();
          expect(_this.view._timeout).toBeFalsy();
        });

        it('paginates backward when scrolled to the end', function(){
          _this.server.respond();
          sinon.stub(_this.view, 'prevPage');
          _this.view.el.find('.comments').trigger('scroll')
              .trigger('scroll');
          expect(_this.view.prevPage).toHaveBeenCalledTwice();
          _this.view.prevPage.restore();
        });

        it('stops paginating when all pages have loaded', function(){
          _this.server.respondWith('GET', '/chats/1/pages/1.json', TestResponses.page.prev);
          _this.server.respond();
          sinon.stub(_this.view.collection, 'fetch');
          _this.view.el.find('.comments').trigger('scroll');
          _this.server.respond();
          expect(_this.view.collection.fetch).not.toHaveBeenCalled();
          _this.view.collection.fetch.restore();
        });

        it('removes messages that have been deleted', function(){
          _this.server.respond();
          expect(_this.view.el.find('.comments li').length).toEqual(3);
          _this.view.collection.remove(_this.view.collection.first());
          expect(_this.view.el.find('.comments li').length).toEqual(2);
        });

        it('resumes polling correctly', function(){
          _this.server.respond();
          _this.view.pause();
          _this.view.pollForContent();
          _this.server.respond();
          expect(_this.view._timeout).toBeFalsy();
          _this.view.resume();
          expect(_this.view._timeout).toBeTruthy();
        });

        describe('when the user is not yet identified', function(){

          beforeEach(function(){
            _this.server.respond();
          })

          it('renders the choose a username box', function(){
            expect(_this.view.el.find('button.identify').length).toBeTruthy();
          });

          it('identifies the user correctly', function(){
            _this.server.respondWith('POST', '/chats/identity.json', TestResponses.identity.create);
            _this.view.el.find('input[name=display_name]').val('John Doe').parents('form').submit();
            _this.server.respond();
            expect(_this.view.model.get('display_name')).toEqual('John Doe');
          });

        });

        describe('when the user is identified', function(){

          beforeEach(function(){
            _this.server.respond();
            _this.server.respondWith('POST', '/chats/identity.json', TestResponses.identity.create);
            _this.view.el.find('input[name=display_name]').val('John Doe').parents('form').submit();
            _this.server.respond();
          });

          it('renders the chat box', function(){
            expect(_this.view.el.find('form.new-message').length).toBeTruthy();
          });

          it('destroys the user\'s identity correctly', function(){
            _this.server.responses.pop();
            _this.server.respondWith('POST', '/chats/identity.json', TestResponses.identity.destroy);
            _this.view.el.find('.destroyIdentity').click();
            _this.server.respond();
            expect(_this.view.model.get('display_name')).toBeFalsy();
            expect(_this.view.el.find('form.new-message').length).toBeFalsy();
            expect(_this.view.el.find('button.identify').length).toBeTruthy();
          });

          it('won\'t double-post messages', function(){
            sinon.stub($, 'ajax');
            _this.view.el.find('form textarea').val('hello, world!').parents('form').submit();
            _this.view.el.find('form textarea').val('goodnight, moon!').parents('form').submit();
            expect($.ajax).toHaveBeenCalledOnce();
            $.ajax.restore();
          });

          it('submits the message when ctrl or cmd-enter is typed', function(){
            sinon.spy($, 'ajax');
            var evt = $.Event('keydown', {keyCode: 13, ctrlKey: true, metaKey: true});
            _this.view.el.find('form textarea').val('hello, world!').trigger(evt);
            expect($.ajax).toHaveBeenCalled();
            $.ajax.restore();
          });

        });

      });

      describe('when live chat has ended', function(){

        beforeEach(function(){
          _this.server.responses = []
          _this.server.respondWith('GET', _this.url, TestResponses.chat.archived);
          _this.server.respond();
        });

        it('displays an archive message', function(){
          expect(_this.view.el.find('.archived').length).toBeTruthy();
        });

      });

    });
  });
})(jQuery);
