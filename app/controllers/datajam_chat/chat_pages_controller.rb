class DatajamChat::ChatPagesController < DatajamChat::EngineController

  def show
    @page = ChatPage.find(params[:id])
    @chat = @page.chat

    respond_to do |format|
      format.json { render :json => locals, :callback => params[:callback] }
    end
  end

end