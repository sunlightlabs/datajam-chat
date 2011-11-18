class DatajamChat::ChatPagesController < DatajamChat::EngineController

  def show
    @page = ChatPage.find(params[:id])

    respond_to do |format|
      format.json { render :json => @page, :callback => params[:callback] }
    end
  end

end