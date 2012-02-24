(function($){
  curl(['chat/collections/message'], function(){
    describe('Message collection', function(){
      var _this = this
        , app = _.extend({}, Datajam.Chat);

      beforeEach(function(){
        _this.server = sinon.fakeServer.create();
        _this.collection = new app.Collections.Message;
        _this.collection.view = {
            archive: function(){}
          , close: function(){}
          , model: {
              toJSON: function(){ return 'null'; }
            }
        }
        _this.collection.model = app.Models.Message;
      });

      afterEach(function(){
        _this.server.restore();
      });

      describe('when new messages are recieved', function(){

        beforeEach(function(){
          _this.url = '/chats/1/pages/2.json';
          _this.server.respondWith('GET', _this.url, TestResponses.page.open);
          _this.collection.url = _this.url;
          _this.collection.fetch({add:true});
          _this.server.respond();
        });

        it("sets models' IDs correctly", function(){
          expect(_this.collection.get('4f1b73fa340942000100001c')).toBeTruthy();
        });

        it("sets models' timestamps correctly", function(){
          expect(_this.collection.get('4f1b73fa340942000100001c').get('timestamp').toDate()).toEqual(new Date(2012,00,21,21,28,06))
        });

        it("sorts messages by timestamp", function(){
          expect(_this.collection.first().id).toEqual('4f1b7409340942000100001f');
          expect(_this.collection.last().id).toEqual('4f1b73ff340942000100001e');
        });

        it("deletes messages that match the deleted_text constant", function(){
          _this.collection.add({
              _id: '4f1b7409340942000100001f'
            , created_at: '2012-01-22T02:27:21+00:00'
            , updated_at: '2012-01-22T02:45:22+00:00'
            , text: app.constants.deleted_message_text
          });

          expect(_this.collection.get('4f1b7409340942000100001f')).toBeFalsy();
        });

        it("updates the text of messages that already exist and have a newer timestamp", function(){
          var text = 'Hiya, Jim-Bob!';
          _this.collection.add({
              _id: '4f1b7409340942000100001f'
            , created_at: '2012-01-22T02:27:21+00:00'
            , updated_at: '2012-01-22T02:45:22+00:00'
            , text: text
          });

          expect(_this.collection.get('4f1b7409340942000100001f').get('text')).toEqual(text);
        });

        it("maintains the oldest seen page param", function(){
          expect(_this.collection._oldest_seen_page).toEqual('/chats/1/pages/1.json');
        });

        describe("when the current page is full", function(){
          beforeEach(function(){
            _this.server = sinon.fakeServer.create();
            _this.server.respondWith('GET', _this.url, TestResponses.page.full);
            _this.collection.fetch({add: true});
            _this.server.respond();
          });

          it("paginates forward", function(){
            expect(_this.collection.url).toEqual('/chats/1/pages/3.json');
          });

          it("maintains the newest seen page param", function(){
            expect(_this.collection._newest_seen_page).toEqual('/chats/1/pages/3.json');
          });

        });

        describe("when the chat is closed", function(){
          beforeEach(function(){
            sinon.spy(_this.collection.view, 'close');
            _this.server = sinon.fakeServer.create();
            _this.server.respondWith('GET', _this.url, TestResponses.page.closed);
            _this.collection.fetch({add: true});
            _this.server.respond();
          });

          afterEach(function(){
            _this.collection.view.close.restore();
          })

          it("sets the chat to closed when the polling results indicate a closed status", function(){
            expect(_this.collection.view.close).toHaveBeenCalled();
          });

        });

        describe("when the chat is archived", function(){
          beforeEach(function(){
            sinon.spy(_this.collection.view, 'archive');
            _this.server = sinon.fakeServer.create();
            _this.server.respondWith('GET', _this.url, TestResponses.page.archived);
            _this.collection.fetch({add: true});
            _this.server.respond();
          });

          afterEach(function(){
            _this.collection.view.archive.restore();
          });

          it("sets the chat to archived when the polling results indicate an archived status", function(){
            expect(_this.collection.view.archive).toHaveBeenCalled();
          });

        });

      });

    });

  });
})(jQuery)