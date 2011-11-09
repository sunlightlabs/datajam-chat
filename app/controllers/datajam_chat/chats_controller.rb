module DatajamChat

  class ChatsController < EngineController

    def index
      @chats = Chat.all()

      respond_to do |format|
        format.html
        format.json { render :json => locals, :callback => params[:callback] }
      end
    end

    def show
      @chat = Chat.find(params[:id])
      @page = JSON.parse @chat.current_page.to_json(:include => :messages)

      respond_to do |format|
        format.html
        format.json { render :json => locals, :callback => params[:callback] }
      end
    end

  end
end