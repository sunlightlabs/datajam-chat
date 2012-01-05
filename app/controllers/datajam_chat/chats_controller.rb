class DatajamChat::ChatsController < DatajamChat::EngineController

  before_filter :authenticate_user!, :only => :update

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

  def update
    @chat = Chat.find(params[:id])
    @chat.update_attributes(params[:model])
    @page = @chat.current_page
    @page.save

    respond_to do |format|
      format.json { render :json => locals, :callback => params[:callback] }
    end
  end

end
