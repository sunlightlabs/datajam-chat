# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)
Setting.find_or_create_by(:namespace => 'datajam_chat', :name => 'bitly_username')
Setting.find_or_create_by(:namespace => 'datajam_chat', :name => 'bitly_api_key')
page_size = Setting.find_or_create_by(:namespace => 'datajam_chat', :name => 'page_size')
page_size.required = true
page_size.value = 100 unless page_size.value?
page_size.save!
Setting.find_or_create_by(:namespace => 'datajam_chat', :name => 'tweet_this_via'
# 'installed' setting is a placeholder to ensure that all plugins will have at least one setting
Setting.find_or_create_by(:namespace => 'datajam_chat', :name => 'installed', :value => true)