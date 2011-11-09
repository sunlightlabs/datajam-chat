module DatajamChat

  class MessageAssetsController < EngineController
    def show
      @message_asset = MessageAsset.find(params[:id])
    end

    def create
      @message_asset = MessageAsset.new({ :message_asset => params[:Filedata] })
      if @message_asset.save
        response = @message_asset
      else
        response = {:errors => ['Unable to save file']}
      end
      respond_to do |format|
        format.json { render :json => response, :callback => params[:callback] }
      end
    end

    def destroy
      response = false
      if current_user
        @message_asset = MessageAsset.find(params[:id])
        response = @message_asset.destroy
      end

      respond_to do |format|
        format.json { render :json => response, :callback => params[:callback] }
      end
    end
  end

end