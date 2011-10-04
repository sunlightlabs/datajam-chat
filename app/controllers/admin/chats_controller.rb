class Admin::ChatsController < AdminController

  def index
  end

  def show
    @chat = Chat.find(params[:id])
  end

  def new
    @chat = Chat.new
  end

  def create
  end

  def destroy
    @chat = Chat.find(params[:id])
    @event = @chat.event
    @chat.destroy
    flash[:notice] = "Chat deleted."
    redirect_to edit_admin_event_path(@event)
  end

  def update
  end

end