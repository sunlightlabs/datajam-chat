require 'spec_helper'

describe ChatThread do
  include MessageExampleHelperMethods

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
  end

  it "is closed by default" do
    @chat.is_open.should eql(false)
  end

  it "has at least one page when published" do
    @chat.update_attributes!(:is_open => true)
    @chat.current_page.should_not eql(nil)
  end

  it "opens a new page when the current page is full" do
    @chat.update_attributes!(:is_open => true)
    first_page = @chat.current_page
    (@chat.page_size+1).times do
      @chat.messages.create(approved_message)
    end
    first_page.messages.length.should eql(2)
    @chat.current_page.id.should_not eql(first_page.id)
  end

  it "accesses approved messages" do
    @chat.update_attributes!(:is_open => true)
    @message = @chat.messages.create(approved_message)
    @chat.approved_messages.entries.should include(@message)
  end

  it "accesses incoming messages" do
    @chat.update_attributes!(:is_open => true)
    @message = @chat.messages.create(incoming_message)
    @chat.incoming_messages.entries.should include(@message)
  end

  it "accesses rejected messages" do
    @chat.update_attributes!(:is_open => true)
    @message = @chat.messages.create(rejected_message)
    @chat.rejected_messages.entries.should include(@message)
  end

  it "caches to the correct path on save" do
    @chat.save
    @redis.get(@chat.cache_path).should match({:updated_at => @chat.updated_at}.to_json.gsub(/(^{|}$)/, ''))
  end

  it "includes a chat page when open" do
    @chat.update_attributes!(:is_open => true)
    @redis.get(@chat.cache_path).should include('"page":{')
  end

  it "includes a chat page when archived" do
    @chat.update_attributes!(:is_open => true)
    @chat.update_attributes!(:is_open => false, :is_archived => true)
    @redis.get(@chat.cache_path).should include('"page":{')
  end

  it "does not include a chat page when closed" do
    @chat.save
    @redis.get(@chat.cache_path).should_not include('"page":{')
  end

end