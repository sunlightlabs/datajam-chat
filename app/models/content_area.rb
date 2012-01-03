class ContentArea
  scope :chats, :where => { :area_type => 'chat_area' }
end