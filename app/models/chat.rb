class Chat

  include Mongoid::Document
  include Mongoid::Timestamps
  include Rails.application.routes.url_helpers
  include ActionDispatch::Routing::UrlFor

  field :is_open, type: Boolean, default: false
  field :page_size, type: Integer

  belongs_to :event
  has_many :chat_pages
  has_many :messages

  after_save :cache_instance

  def initialize
    chat_pages << ChatPage.new
  end

  def current_page
    page = chat_pages.order_by([:updated_at, :desc]).first
    if (page && page.is_open!) or not self.is_open?
      page
    else
      page = chat_pages.create!
      save
      begin
        page.prev_page.save
      rescue
        nil
      end
      page
    end
  end

  def cache_path
    chat_path(:id => self.id, :format => :json)
  end


  private

  def cache_instance
    content = { :chat => self, :page => JSON.parse(current_page.to_json(:include => :messages)) }.to_json
    path = cache_path
    logger.info "Caching #{path}..."
    Cacher::cache(path, content)
  end

end
