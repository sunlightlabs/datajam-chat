Setting.find_or_create_by(:namespace => 'datajam-chat', :name => 'bitly_username')
Setting.find_or_create_by(:namespace => 'datajam-chat', :name => 'bitly_api_key')
page_size = Setting.find_or_create_by(:namespace => 'datajam-chat', :name => 'page_size')
page_size.required = true
page_size.value = 100 unless page_size.value?
page_size.save!
Setting.find_or_create_by(:namespace => 'datajam-chat', :name => 'tweet_this_via')
Setting.find_or_create_by(:namespace => 'datajam-chat', :name => 'default_avatar_url')
Setting.find_or_create_by(:namespace => 'datajam-chat', :name => 'closed_chat_message')
# 'installed' setting is a placeholder to ensure that all plugins will have at least one setting
Setting.find_or_create_by(:namespace => 'datajam-chat', :name => 'installed', :value => true)