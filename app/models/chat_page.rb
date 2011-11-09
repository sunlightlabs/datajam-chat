class ChatPage

  include Mongoid::Document
  include Mongoid::Timestamps
  include Rails.application.routes.url_helpers
  include ActionDispatch::Routing::UrlFor

  field :is_open, type: Boolean, default: true

  belongs_to :chat
  has_many :messages

  after_save :cache_instance

  alias_method :to_json_original, :to_json

  def is_open!
    # checks for 'openness' versus maximum page size, closing if met or exceeded
    # does not 're-open' when page size is adjusted larger
    if is_open? and messages.length >= DatajamChat.config[:page_size]
      self.update_attributes!(is_open: false)
    end

    is_open
  end

  def next_page
    ChatPage.where(:chat_id => chat.id, :updated_at.gt => updated_at).order_by([:updated_at, :asc]).first
  end

  def prev_page
    ChatPage.where(:chat_id => chat.id, :updated_at.lt => updated_at).order_by([:updated_at, :desc]).first
  end

  def to_json(params=nil)
    repr = JSON.parse to_json_original(params)
    repr.update('is_open' => is_open?,
                'next_page' => (next_page.cache_path rescue nil),
                'prev_page' => (prev_page.cache_path rescue nil)
               )
    repr.to_json
  end

  def cache_path
    chat_chat_page_path(:chat_id => self.chat.id, :id => self.id, :format => :json)
  end


  private

  def cache_instance
    content = { :chat => chat, :page => JSON.parse(to_json :include => :messages) }.to_json
    path = cache_path
    logger.info "Caching #{path}..."
    Cacher::cache(path, content)
  end

end
