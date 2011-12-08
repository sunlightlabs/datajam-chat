class Chat

  include Mongoid::Document
  include Mongoid::Timestamps
  include Rails.application.routes.url_helpers
  include ActionDispatch::Routing::UrlFor

  field :is_open, type: Boolean, default: false
  field :is_archived, type: Boolean, default: false

  belongs_to :event, index: true
  has_many :pages, class_name: "ChatPage"
  has_many :messages, class_name: "ChatMessage"

  validates_presence_of :event
  validates_numericality_of :page_size, :greater_than => 0

  after_save :cache_instance

  def current_page
    save! unless persisted?
    latest_page = pages.order_by([:created_at, :desc]).first
    if (latest_page && latest_page.is_open!) or not self.is_open?
      latest_page
    else
      latest_page = pages.create!
      save
      # queue up next_page on our new prev_page if it exists
      latest_page.prev_page.save rescue nil
      latest_page
    end
  end

  def page_size
    Datajam::Settings[:datajam_chat][:page_size].to_i
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

  def publish_everything!
    pages.each {|page| page.save }
    save
  end

  private

  def cache_instance
    if is_open? or is_archived?
      content = {:chat => as_json, :page => (self.current_page.as_json(:include => :messages) rescue nil)}.to_json
    else
      content = {:chat => as_json}.to_json
    end
    path = cache_path
    logger.info "Caching #{path}..."
    Cacher::cache(path, content)
  end

end
