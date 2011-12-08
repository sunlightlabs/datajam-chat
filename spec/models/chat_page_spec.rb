require 'spec_helper'

describe ChatPage do
  include MessageExampleHelperMethods
  before(:all) do
    @event = Event.new
  end

  before(:each) do
    @chat = Chat.create!(:event => @event, :is_open => true)
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

  it "paginates forward when possible" do
    (@chat.page_size+1).times do
      @chat.messages.create!(approved_message)
    end
    @page.next_page.id.should eql(@chat.current_page.id)
  end

  it "paginates backward when possible" do
    (@chat.page_size+1).times do
      @chat.messages.create!(approved_message)
    end
    @chat.current_page.prev_page.id.should eql(@page.id)
  end

  it "includes status in json output" do
    @chat.current_page.save
    @redis.get(@chat.current_page.cache_path).should include({:is_open => @chat.current_page.is_open}.to_json.gsub(/(^{|}$)/, ''))
  end

  it "includes pagination in json output" do
    @chat.current_page.save
    @redis.get(@chat.current_page.cache_path).should include({:next_page => @chat.current_page.next_page}.to_json.gsub(/(^{|}$)/, ''))
    @redis.get(@chat.current_page.cache_path).should include({:prev_page => @chat.current_page.prev_page}.to_json.gsub(/(^{|}$)/, ''))
  end

  it "includes messages in json output" do
    @chat.current_page.save
    @redis.get(@chat.current_page.cache_path).should include({:messages => @chat.current_page.messages}.to_json.gsub(/(^{|}$)/, ''))
  end

  it "includes parent chat in json output" do
    @chat.current_page.save
    @redis.get(@chat.current_page.cache_path).should include({:chat => @chat.as_json}.to_json.gsub(/(^{|}$)/, ''))
  end

  it "publishes to cache on save" do
    @chat.current_page.save
    @redis.get(@chat.cache_path).should include({:updated_at => @chat.current_page.updated_at}.to_json.gsub(/(^{|}$)/, ''))
    @redis.get(@chat.current_page.cache_path).should include({:updated_at => @chat.current_page.updated_at}.to_json.gsub(/(^{|}$)/, ''))
  end

end