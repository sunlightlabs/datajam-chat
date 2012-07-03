require 'spec_helper'

describe ChatPage do
  include MessageExampleHelperMethods

  before(:each) do
    body = <<-ENDBODY.strip_heredoc
      <h2>{{ header }}</h2>
      <p>{{ description }}</p>
      <p>{{ chat_area: Test Chat }}</p>
    ENDBODY
    event_template = EventTemplate.create(name: 'Chat Event Template', template: body)
    data =  { "header" => "Hello World", "description" => "This is the description." }
    @event = Event.create!(name: 'Chat Test Event', scheduled_at: '2099-12-31', event_template: event_template, template_data: data)
    @chat = @event.content_areas.select {|area| area.area_type == 'chat_area'}.first.chat
    @chat.update_attributes(:is_open => true)
    @page = @chat.current_page
  end

  it "is invalid without a chat" do
    @page = ChatPage.new
    @page.save.should eql(false)
    @page.errors.should include(:chat)
  end

  it "closes itself when full" do
    (@chat.page_size+1).times do
      @chat.messages.create!(approved_message)
    end
    @page.is_open!.should eql(false)
  end

  it "doesn't close itself when not full" do
    Datajam::Settings[:'datajam-chat'][:page_size] = 11
    10.times do
      @chat.messages.create!(approved_message)
    end
    @chat.pages.length.should eql(1)
  end

  it "paginates forward when possible" do
    (@chat.page_size+1).times do
      message = @chat.messages.create!(approved_message)
      sleep(0.5) # hack for proper sort order in current_page
    end
    @page.next_page.id.should eql(@chat.current_page.id)
  end

  it "paginates backward when possible" do
    (@chat.page_size+1).times do
      @chat.messages.create!(approved_message)
      sleep(0.5) # hack for proper sort order in current_page
    end
    @chat.current_page.prev_page.id.should eql(@page.id)
  end

  it "includes status in json output" do
    @chat.current_page.save
    @redis.get(@chat.current_page.cache_path).should include({:is_open => @chat.current_page.is_open}.to_json.gsub(/(^\{|\}$)/, ''))
  end

  it "includes pagination in json output" do
    @chat.current_page.save
    @redis.get(@chat.current_page.cache_path).should include({:next_page => @chat.current_page.next_page}.to_json.gsub(/(^\{|\}$)/, ''))
    @redis.get(@chat.current_page.cache_path).should include({:prev_page => @chat.current_page.prev_page}.to_json.gsub(/(^\{|\}$)/, ''))
  end

  it "includes messages in json output" do
    @chat.current_page.save
    @redis.get(@chat.current_page.cache_path).should include({:messages => @chat.current_page.messages}.to_json.gsub(/(^\{|\}$)/, ''))
  end

  it "includes parent chat in json output" do
    @chat.current_page.save
    @redis.get(@chat.current_page.cache_path).should include({:chat => @chat.as_json}.to_json.gsub(/(^\{|\}$)/, ''))
  end

  it "publishes to cache on save" do
    @chat.current_page.save
    @redis.get(@chat.cache_path).should include({:updated_at => @chat.current_page.updated_at}.to_json.gsub(/(^\{|\}$)/, ''))
    @redis.get(@chat.current_page.cache_path).should include({:updated_at => @chat.current_page.updated_at}.to_json.gsub(/(^\{|\}$)/, ''))
  end

end