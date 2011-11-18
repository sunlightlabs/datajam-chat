class Chat

  include Mongoid::Document
  include Mongoid::Timestamps
  include Rails.application.routes.url_helpers
  include ActionDispatch::Routing::UrlFor

  field :is_open, type: Boolean, default: false
  field :page_size, type: Integer

  belongs_to :event, index: true
  has_many :pages, class_name: "ChatPage"
  has_many :messages, class_name: "ChatMessage"

  after_save :cache_instance

  def initialize
    pages << ChatPage.new
  end

  def current_page
    page = pages.order_by([:updated_at, :desc]).first
    if (page && page.is_open!) or not self.is_open?
      page
    else
      page = pages.create!
      save
      page.prev_page.save rescue nil
      page
    end
  end

  def cache_path
    chat_path(:id => self.id, :format => :json)
  end

  def incoming_messages
    messages.where(:is_moderated => false)
  end

  def approved_messages
    messages.where(:is_public => true)
  end

  def rejected_messages
    messages.where(:is_moderated => true, :is_public => false)
  end

  private

  def cache_instance
    @messages = current_page.messages
    content = { :chat => self, :page => current_page.as_json.merge({:messages => @messages.as_json}) }.to_json
    path = cache_path
    logger.info "Caching #{path}..."
    Cacher::cache(path, content)
  end

end
