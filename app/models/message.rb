class Message

  include Mongoid::Document
  include Mongoid::Timestamps

  field :display_name, type: String
  field :text, type: String
  field :is_public, type: Boolean, default: false
  field :is_moderated, type: Boolean, default: false

  belongs_to :chat
  belongs_to :chat_page
  belongs_to :user
  has_many :message_assets

  validates_presence_of :chat
  validates_presence_of :display_name

  after_save :paginate


  private

  def paginate
    if is_public? and not chat_page
      chat.current_page.messages << self
      chat.save
      chat.current_page.save
    end
  end

end
