class DatajamChat::ChatsController < DatajamChat::EngineController

  def index
    @chats = Chat.all()

    respond_to do |format|
      format.html
      format.json { render :json => locals, :callback => params[:callback] }
    end
  end

  def show
    @chat = Chat.find(params[:id])
    @page = @chat.current_page

    respond_to do |format|
      format.html
      format.json { render :json => locals, :callback => params[:callback] }
    end
  end

end
