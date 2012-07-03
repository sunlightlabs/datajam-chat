module Datajam
  module Chat
    class ChatAssetsController < EngineController
      def show
        @chat_asset = ChatAsset.find(params[:id])
      end

      def create
        @chat_asset = ChatAsset.new({ :chat_asset => params[:chat_asset] })
        if @chat_asset.save
          response = @chat_asset.as_json.update(:url => @chat_asset.chat_asset.url)
        else
          response = {:errors => @chat_asset.errors}
        end
        respond_to do |format|
          format.json do
            if response.include? :errors
              render :json => response, :callback => params[:callback], :status => 409
            else
              render :json => response, :callback => params[:callback]
           end
         end
        end
      end

      def destroy
        response = false
        if current_user
          @chat_assets = ChatAsset.where(:asset_filename.in => params[:filenames])
          @chat_assets.each do |asset|
            asset.destroy
            response = true
          end
        end
        respond_to do |format|
          format.json { render :json => response, :callback => params[:callback] }
        end
      end
    end
  end
end
