class ChatsController < ApplicationController
  def show
    @chat = Chat.find(params[:id])

    respond_to do |format|
      format.json { render :json => @chat.to_json }
    end
  end
end