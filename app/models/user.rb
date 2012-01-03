class User
  has_many :messages, class_name: "ChatMessage", inverse_of: :user
end