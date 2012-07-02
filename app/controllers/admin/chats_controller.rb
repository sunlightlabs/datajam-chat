class Admin::ChatsController < AdminController

  def index
    @chats = ChatThread.all
  end

  def show
    @chat = ChatThread.find(params[:id])
    render :layout => "chat_admin"
  end

  def destroy
    @chat = ChatThread.find(params[:id])
    @event = @chat.event
    @chat.destroy
    flash[:notice] = "Chat deleted."
    redirect_to edit_admin_event_path(@event)
  end

  def update
    @chat = ChatThread.find(params[:id])
    if @chat.update_attributes(params[:chat])
      flash[:notice] = "Chat updated."
    else
      flash[:error] = "There was an error updating this chat."
    end
    @event = @chat.event
    redirect_to edit_admin_event_path(@event)
  end

end