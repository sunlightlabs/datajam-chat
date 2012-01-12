class ChatPage

  include Mongoid::Document
  include Mongoid::Timestamps
  include Rails.application.routes.url_helpers
  include ActionDispatch::Routing::UrlFor

  field :is_open, type: Boolean, default: true

  belongs_to :chat, index: true
  has_many :messages, class_name: "ChatMessage", inverse_of: :page

  after_save :cache_instance


  validates_presence_of :chat

  def is_open!
    # checks for 'openness' versus maximum page size, closing if met or exceeded
    # does not 're-open' when page size is adjusted larger
    if is_open? && (messages.length >= chat.page_size.to_i)
      update_attributes(:is_open => false)
      return false
    end
    return is_open?
  end

  def next_page
    ChatPage.where(:chat_id => self.chat.id, :created_at.gt => self.created_at).order_by([:created_at, :asc]).first
  end

  def prev_page
    ChatPage.where(:chat_id => self.chat.id, :created_at.lt => self.created_at).order_by([:created_at, :desc]).first
  end

  def as_json(options={})
    super(options).update(
      'is_open' => is_open?,
      'next_page' => (next_page.cache_path rescue nil),
      'prev_page' => (prev_page.cache_path rescue nil)
    ).merge({:messages => messages.as_json})
  end

  def cache_path
    chat_page_path(:chat_id => self.chat.id, :id => self.id, :format => :json)
  end


  protected

  def cache_instance
    content = { :chat => chat, :page => as_json }.to_json
    path = cache_path
    logger.info "Caching #{path}..."
    Cacher::cache(path, content)
  end

end
