class Chat

  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug

  belongs_to :event
  has_many :messages

end
