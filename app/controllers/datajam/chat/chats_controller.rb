module Datajam
  module Chat
    class ChatsController < EngineController
      before_filter :authenticate_user!, :only => :update

      def index
        @chats = ChatThread.all()

        respond_to do |format|
          # format.html
          format.json { render :json => locals, :callback => params[:callback] }
        end
      end

      def show
        @chat = ChatThread.find(params[:id])
        @page = @chat.current_page

        respond_to do |format|
          # format.html
          format.json { render :json => locals, :callback => params[:callback] }
        end
      end

      def update
        @chat = ChatThread.find(params[:id])
        @chat.update_attributes(params[:model])
        @page = @chat.current_page
        @page.save

        respond_to do |format|
          format.json { render :json => locals, :callback => params[:callback] }
        end
      end
    end
  end
end
