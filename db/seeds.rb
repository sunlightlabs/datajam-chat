# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)
settings = Setting.create([
  {:namespace => 'datajam_chat', :name => 'Bit.ly Username'},
  {:namespace => 'datajam_chat', :name => 'Bit.ly API Key'},
  {:namespace => 'datajam_chat', :name => 'Tweet this via'},
])