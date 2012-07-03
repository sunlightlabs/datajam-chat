[![Build Status](https://secure.travis-ci.org/sunlightlabs/datajam-datacard.png)](http://travis-ci.org/sunlightlabs/datajam-datacard)

Datajam Chat adds live chat to your events.

### Install:

1. add datajam-chat to your gemfile; currently from github:

    `gem 'datajam-chat', :git => 'git://github.com/sunlightlabs/datajam-chat.git'`

2. run `bundle install`
3. click `install` link on the plugin settings page
4. add a chat area to your event template, e.g., `{{ chat_area: Live Chat }}`

### Uninstall:

1. remove chat area
2. click `uninstall` link on the plugin settings page

### Sessions:

Users are anonymous, but their session id is the key to reserving their nickname. Before each event starts, you should click the `clear sessions` link on the plugin settings page.

### Settings:

Only page size is required.

__Bit.ly username & api key:__ If set, links in chat messages will
automatically be shortened using your bit.ly account

__Page size:__ The maximum number of messages to return per call to the server

__Tweet this via:__ If set, tweets from chat will reference the value
as (via @myvalue)
