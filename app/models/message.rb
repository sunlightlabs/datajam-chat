class Message

  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug

  field :text, type: String

  belongs_to :chat
  belongs_to :user

end
