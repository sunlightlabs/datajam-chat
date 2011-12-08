class Admin::ChatsController < AdminController

  def index
    @chats = Chat.all
  end

  def show
    @chat = Chat.find(params[:id])
  end

  def destroy
    @chat = Chat.find(params[:id])
    @event = @chat.event
    @chat.destroy
    flash[:notice] = "Chat deleted."
    redirect_to edit_admin_event_path(@event)
  end

  def update
    @chat = Chat.find(params[:id])
    if @chat.update_attributes(params[:chat])
      flash[:notice] = "Chat updated."
    else
      flash[:error] = "There was an error updating this chat."
    end
    @event = @chat.event
    redirect_to edit_admin_event_path(@event)
  end

end