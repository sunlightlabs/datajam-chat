Datajam Chat adds live chat to your events.

### Install:

1. add datajam\_chat to your gemfile; currently from github:
    
    `gem 'datajam_chat', :git => 'git://github.com/sunlightlabs/datajam_chat.git'`
    
2. run `bundle install`
3. run `rake datajam_chat:install_assets`
4. deploy heroku
5. run `heroku run rake datajam_chat:install_settings`
6. Add a chat area to your event template, e.g., `{{ chat_area: Live Chat }}`

### Uninstall:

1. remove chat area
2. run `heroku run rake datajam_chat:uninstall_settings`
3. run `rake datajam_chat:uninstall_assets`
4. deploy heroku

### Settings:

Only page size is required.

__Bit.ly username & api key:__ If set, links in chat messages will
automatically be shortened using your bit.ly account

__Page size:__ The maximum number of messages to return per call to the server

__Tweet this via:__ If set, tweets from chat will reference the value
as (via @myvalue)