class ChatMessage

  include Mongoid::Document
  include Mongoid::Timestamps

  field :display_name, type: String
  field :text, type: String
  field :is_public, type: Boolean, default: false
  field :is_moderated, type: Boolean, default: false

  belongs_to :chat, index: true
  belongs_to :page, class_name: "ChatPage", inverse_of: :messages, index: true
  belongs_to :user, index: true

  validates_presence_of :chat
  validates_presence_of :display_name
  validates_length_of :text, allow_blank: false, maximum: 1000

  before_save :shorten_urls
  after_save :paginate

  def approve
    update_attributes(:is_public => true, :is_moderated => true)
  end

  def reject
    update_attributes(:is_public => false, :is_moderated => true)
  end

  def as_json(options={})
    @user = user.as_json rescue nil
    super(:except => [:user_id, :chat_id, :page_id]).merge({:user => @user})
  end

  def depaginate
    page.messages.delete self
    page.save
  end

  private

  def paginate
    if is_public? and not page
      chat.current_page.messages << self
      chat.save
      chat.current_page.save
    end
  end

  def shorten_urls
    self.text = self.text.gsub(/https?:\/\/[\w\-\/#\.%\?=&:,|]+[\w\-\/#=&]/) do |long_url|
      unless long_url =~ /\.(png|gif|jpe?g|bmp)$/
        begin
          DatajamChat::bitly.shorten(long_url).short_url
        rescue
          long_url
        end
      else long_url
      end
    end rescue self.text
  end

end
