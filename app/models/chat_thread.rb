class ChatThread
  include Mongoid::Document
  include Mongoid::Timestamps
  include Rails.application.routes.url_helpers
  include ActionDispatch::Routing::UrlFor

  field :is_open,       type: Boolean, default: false
  field :is_archived,   type: Boolean, default: false

  has_many :pages,      class_name: "ChatPage",     inverse_of: :chat
  has_many :messages,   class_name: "ChatMessage",  inverse_of: :chat

  validates_numericality_of :page_size, :greater_than => 0

  after_save :cache_instance


  def current_page
    save unless persisted?

    latest_page = pages.last
    unless (latest_page && latest_page.is_open!) || !self.is_open?
      prev_page = latest_page
      latest_page = self.pages.create!
      # queue up next_page on our new prev_page if it exists
      prev_page.save rescue nil
      # update the chat's current_page too
      save
    end
    latest_page
  end

  def page_size
    Datajam::Settings[:chat][:page_size].to_i
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

  def cache_path
    chat_path(:id => self.id, :format => :json)
  end

  def cache_reset!
    pages.each {|page| page.save! }
    save!
  end

  protected

  def cache_instance
    ChatThread.skip_callback(:save, :after, :cache_instance)
    if is_open? or is_archived?
      content = {:chat => as_json, :page => (self.current_page.as_json(:include => :messages) rescue nil)}.to_json
    else
      content = {:chat => as_json}.to_json
    end
    ChatThread.set_callback(:save, :after, :cache_instance)

    path = cache_path
    logger.info "Caching #{path}..."
    Cacher::cache(path, content)
  end

end
