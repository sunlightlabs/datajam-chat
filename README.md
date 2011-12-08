Datajam Chat adds live chat to your events.

### Installation:

Run `rake db:seed` after adding datajam_chat to your gemspec and
running bundle install.

### Settings:

All settings are optional.

__Bit.ly username & api key:__ If set, links in chat messages will
automatically be shortened using your bit.ly account

__Page size:__ The maximum number of messages to return per call to the server

__Tweet this via:__ If set, tweets from chat will reference the value
as (via @myvalue)