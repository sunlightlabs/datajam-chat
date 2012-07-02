module Datajam
  class Chat::ChatPagesController < Chat::EngineController
    def show
      @page = ChatPage.find(params[:id])
      @chat = @page.chat_thread

      respond_to do |format|
        format.json { render :json => locals, :callback => params[:callback] }
      end
    end
  end
end