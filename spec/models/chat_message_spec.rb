require 'spec_helper'

describe ChatMessage do
  include MessageExampleHelperMethods
  use_vcr_cassette "chat_message"

  before(:each) do
    body = <<-ENDBODY.strip_heredoc
      <h2>{{ header }}</h2>
      <p>{{ description }}</p>
      <p>{{ chat_area: Test Chat }}</p>
    ENDBODY
    event_template = EventTemplate.create(name: 'Chat Event Template', template: body)
    data =  { "header" => "Hello World", "description" => "This is the description." }
    @event = Event.create!(name: 'Chat Test Event', scheduled_at: '2099-12-31', :event_template => event_template, :template_data => data)
    @chat = @event.content_areas.select {|area| area.area_type == 'chat_area'}.first.chat
    @chat.update_attributes(:is_open => true)
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

  it "shortens its urls on save if bitly credentials are set" do
    Datajam::Chat::bitly.instance_variable_set(:@default_query_opts, :login => 'sunlightlabstest', :apiKey => 'R_4a9fd69e8bd11ad20be192740a8c3816')
    @message = @chat.messages.create!(approved_message.merge!(:text => 'Hello http://sunlightfoundation.com!'))
    @message.text.should include('http://bit.ly')
  end

  it "leaves urls expanded on save if bitly credentials are unset" do
    Datajam::Chat::bitly.instance_variable_set(:@default_query_opts, :login => nil, :apiKey => nil)
    @message = @chat.messages.create!(approved_message.merge!(:text => 'Hello http://sunlightfoundation.com!'))
    @message.text.should include('http://sunlightfoundation.com')
  end

  it "paginates on save" do
    @message = @chat.messages.create!(approved_message)
    @chat.current_page.messages.should include(@message)
  end

  it "publishes when approved" do
    @message = @chat.messages.create!(incoming_message)
    @message.update_attributes!(:is_public => true, :is_moderated => true)
    @redis.get(@chat.current_page.cache_path).should include(@message.to_json)
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
    Datajam::Settings[:'datajam-chat'][:page_size] = 3
    @message = @chat.messages.create!(approved_message)
    (@chat.page_size).times do
      @chat.messages.create!(approved_message)
      sleep(0.5) # hack for proper sort order in current_page
    end
    @message.update_with(:text => 'Goodbye, cruel world!')
    @chat.current_page.messages.should include(@message)
  end

end