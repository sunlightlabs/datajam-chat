class ChatArea < ContentArea
  belongs_to :chat, class_name: "ChatThread", inverse_of: :area

  after_initialize :ensure_chat

  def render_head
    renderer.render(:partial => "datajam/chat/chat_areas/head_assets")
  end

  def render_body
    renderer.render(:partial => "datajam/chat/chat_areas/body_assets")
  end

  def render
    renderer.render(
      :partial => "datajam/chat/chat_areas/content",
      :locals => {:chat_area => self}
    )
  end

  def render_update
    render
  end

  def as_json(options = {})
    super.merge({:chat_id => chat.id})
  end

  protected

  def ensure_chat
    self.chat ||= ChatThread.create!
  end

  def renderer
    @@av ||= ActionView::Base.new(Datajam::Chat::Engine.paths['app/views'].first)
  end
end
