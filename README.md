# Chat

[![Build Status](https://secure.travis-ci.org/sunlightlabs/datajam-datacard.png)](http://travis-ci.org/sunlightlabs/datajam-datacard)

Datajam Chat adds live chat to your events.

## Installation

Add datajam-chat to your gemfile; currently from github:

    gem 'datajam-chat', :git => 'git://github.com/sunlightlabs/datajam-chat.git', :require => 'datajam/chat'

Run `bundle install`

Click `install` link on the plugin settings page

Add a chat area to your event template:

    {{ chat_area: Live Chat }}

## Uninstall

Remove chat area from your template.

Click `uninstall` link on the plugin settings page

## Sessions

Users are anonymous, but their session id is the key to reserving their nickname. Before each event starts, you should clear the chat sessions from the system via the 'Actions' tab:

![Clear sessions](https://img.skitch.com/20120705-b2x32qqb775gwb7e9jdfiabtq8.png)

## Settings

Only page size is required.

__Bit.ly username & api key:__ If set, links in chat messages will
automatically be shortened using your bit.ly account

__Page size:__ The maximum number of messages to return per call to the server

__Tweet this via:__ If set, tweets from chat will reference the value
as (via @myvalue)

## Developers

See [CONTRIBUTING.md](https://github.com/sunlightlabs/datajam-chat/blob/master/CONTRIBUTING.md)
