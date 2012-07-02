Setting.find_or_create_by(:namespace => 'chat', :name => 'bitly_username')
Setting.find_or_create_by(:namespace => 'chat', :name => 'bitly_api_key')
page_size = Setting.find_or_create_by(:namespace => 'chat', :name => 'page_size')
page_size.required = true
page_size.value = 100 unless page_size.value?
page_size.save!
Setting.find_or_create_by(:namespace => 'chat', :name => 'tweet_this_via')
Setting.find_or_create_by(:namespace => 'chat', :name => 'default_avatar_url')
# 'installed' setting is a placeholder to ensure that all plugins will have at least one setting
Setting.find_or_create_by(:namespace => 'chat', :name => 'installed', :value => true)