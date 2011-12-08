require 'spec_helper'

describe ChatMessage do
  include MessageExampleHelperMethods
  use_vcr_cassette "chat_message"

  before(:all) do
    @event = Event.new
  end
  before(:each) do
    # having chat here sucks, but the settings get cleaned up so they need to be in the global each block
    @chat = Chat.create!(:event => @event, :is_open => true)
    @message = ChatMessage.new
  end

  it "is invalid without a chat" do
    @message.save.should eql(false)
    @message.errors.should include(:chat)
  end

  it "is invalid without a display_name" do
    @message.save.should eql(false)
    @message.errors.should include(:display_name)
  end

  it "limits the message length to 1000 characters" do
    @message = @chat.messages.create(approved_message.merge!(:text => ('a' * 1001)))
    @message.persisted?.should eql(false)
    @message.errors.should include(:text)
  end

  it "shortens its urls on save" do
    @message = @chat.messages.create!(approved_message.merge!(:text => 'Hello http://sunlighfoundation.com!'))
    @message.text.should include('http://bit.ly')
  end


  it "paginates on save" do
    @message = @chat.messages.create!(approved_message)
    @chat.current_page.messages.should include(@message)
  end

  it "sets the correct status when approved" do
    @message = @chat.messages.create!(incoming_message)
    @message.approve
    @message.is_public.should eql(true)
    @message.is_moderated.should eql(true)
  end

  it "sets the correct status when rejected" do
    @message = @chat.messages.create!(incoming_message)
    @message.reject
    @message.is_public.should eql(false)
    @message.is_moderated.should eql(true)
  end

  it "includes user objects in its json representation" do
    @user = User.create!(:name => 'Hello world', :email => 'hello@example.com', :password => 'password')
    @message = @chat.messages.create!(approved_message.merge!(:user => @user))
    @message.to_json.should include("user")
  end

  it "can be repaginated" do
    # need to set page size to an odd number > 1 so current_page won't roll over
    Setting.where(:namespace => 'datajam_chat', :name => 'page_size').first.update_attributes!(:value => 3)
    Datajam::Settings.flush(:datajam_chat)
    @message = @chat.messages.create!(approved_message)
    (@chat.page_size).times do
      @chat.messages.create!(approved_message)
    end
    @message.repaginate!
    @chat.current_page.messages.should include(@message)
  end

end