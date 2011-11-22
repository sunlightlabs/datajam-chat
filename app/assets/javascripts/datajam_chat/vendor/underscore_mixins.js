// string filters for underscore
_.mixin({
    capitalize : function(string) {
      return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    }
  , imgify : function(string, pattern) {
      var html = $('<div>' + string + '</div>')
        , pattern = pattern;
      html.find('a').each(function(){
        if($(this).text().search(pattern) > -1){
          $(this).html('<img src="' + $(this).html() + '" />');
        };
      });
      return html.html();
    }
  , linebreaks : function(string) {
      return string.replace(/\n/g, '<br>');
    }
  , linkify : function(string, pattern) {
      var string = string.replace(pattern, function(match,offset){return match.link(match)});
      return string.replace('<a ', '<a target="_blank" ');
    }
  , spaceify : function(string) {
      return string.replace(/(\s)\s/g, '$1&nbsp;')
    }
  , striptags : function(string) {
      return $('<div>' + string + '</div>').text();
    }
  , truncate : function(string, length) {
      var truncated = string.slice(0, length);
      if(truncated == string)
        return string;

      return truncated + '...';
    }
  , tweetablestriptags : function(string) {
      node = $('<div>' + string + '</div>');
      node.find('img').each(function(){
        $(this).replaceWith($(this).attr('src'));
      });
      return node.text();
    }
});