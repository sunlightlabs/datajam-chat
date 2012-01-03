Datajam Chat adds live chat to your events.

### Installation:

Run `rake datajam_chat:install` after adding datajam_chat to your gemspec and
running bundle install.

### Settings:

Only page size is required.

__Bit.ly username & api key:__ If set, links in chat messages will
automatically be shortened using your bit.ly account

__Page size:__ The maximum number of messages to return per call to the server

__Tweet this via:__ If set, tweets from chat will reference the value
as (via @myvalue)