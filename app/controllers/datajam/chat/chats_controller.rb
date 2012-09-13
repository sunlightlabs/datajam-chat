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
        attrs_to_set = JSON.parse(params[:model]).keep_if {|k, v| @chat.fields.keys.include? k }
        @chat.update_attributes(attrs_to_set)
        @page = @chat.current_page
        @page.save rescue nil

        respond_to do |format|
          format.json { render :json => locals, :callback => params[:callback] }
        end
      end
    end
  end
end
