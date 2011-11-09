module DatajamChat

  class ChatPagesController < EngineController

    def show
      @page = ChatPage.find(:chat_id => params[:chat_id], :id => params[:id])

      respond_to do |format|
        format.json { render :json => @page, :callback => params[:callback], :include => :messages }
      end
    end

  end
end