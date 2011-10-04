# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)
event = Event.first
user = User.first
chat = Chat.create({:event => event})
messages = Message.create([
  {:event => event, :user => user, :chat => chat, :text => 'hello world!'}
])