(function($){
  curl(['chat/libs/moment.min'], function(){

    Fixtures = {
      message: {
        incoming: (function(){
          var attrs = {};
          attrs.id = '1';
          attrs.user = null;
          attrs.display_name = 'John Doe';
          attrs.created_at = "2012-01-23T22:42:01Z";
          attrs.updated_at = "2012-01-23T22:42:01Z";
          attrs.timestamp = moment(attrs.updated_at, 'YYYY-MM-DDTHH:mm:ss');
          attrs.is_moderated = false;
          attrs.is_public = false;
          attrs.text = "this is a <em>test</em> with a\n\
                       http://link.com and    an\n\
                       http://link.com/image.png that is also really long,\n\
                       definitely longer than 100 characters. Long enough to\n\
                       need some truncation. For sure. Definitely at least that long";
          return attrs;
        })(),
        approved: (function(){
          var attrs = {};
          attrs.id = '1';
          attrs.user = null;
          attrs.display_name = 'John Doe';
          attrs.created_at = "2012-01-23T22:42:01Z";
          attrs.updated_at = "2012-01-23T22:42:01Z";
          attrs.timestamp = moment(attrs.updated_at, 'YYYY-MM-DDTHH:mm:ss');
          attrs.is_moderated = true;
          attrs.is_public = true;
          attrs.text = "this is a <em>test</em> with a\n\
                       http://link.com and    an\n\
                       http://link.com/image.png that is also really long,\n\
                       definitely longer than 100 characters. Long enough to\n\
                       need some truncation. For sure. Definitely at least that long";
          return attrs;
        })(),
        rejected: (function(){
          var attrs = {};
          attrs.id = '1';
          attrs.user = null;
          attrs.display_name = 'John Doe';
          attrs.created_at = "2012-01-23T22:42:01Z";
          attrs.updated_at = "2012-01-23T22:42:01Z";
          attrs.timestamp = moment(attrs.updated_at, 'YYYY-MM-DDTHH:mm:ss');
          attrs.is_moderated = true;
          attrs.is_public = false;
          attrs.text = "this is a <em>test</em> with a\n\
                       http://link.com and    an\n\
                       http://link.com/image.png that is also really long,\n\
                       definitely longer than 100 characters. Long enough to\n\
                       need some truncation. For sure. Definitely at least that long";
          return attrs;
        })()
      }
    }

  });
})(jQuery);