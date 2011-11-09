module DatajamChat

  class MessagesController < EngineController
    before_filter :authenticate_user!, :except => [:create]

    def index
      @chat = Chat.find(params[:chat_id])
      @limit =  params[:limit] ? params[:limit].to_i : 100
      @incoming = @chat.messages.where(:is_moderated => false).limit(@limit)
      @rejected = @chat.messages.where(:is_moderated => true, :is_public => false).limit(@limit)
      @approved = @chat.messages.where(:is_public => true).limit(@limit)

      respond_to do |format|
        format.json { render :json => locals, :callback => params[:callback] }
      end
    end

    def create
      @chat = Chat.find(params[:chat_id])
      @message = Message.new(:text => params[:text], :chat_id => params[:chat_id])

      if current_user
        @message.user = current_user
        @message.display_name = current_user.name
        @message.is_public = true
        @message.is_moderated = true
      elsif session[:display_name]
        @message.display_name = session[:display_name]
      else
        response = {:errors => "You need to be identified to post"}
      end

      if @message && @message.save
        response = @message
      else
        response = @message.errors
      end

      respond_to do |format|
        format.json { render :json => response, :callback => params[:callback] }
      end
    end

    def update
      @message = Message.find(params[:id])
      @message.is_public = true if params[:action] == 'approve'
      @message.is_moderated = true
      if @message.save
        response = @message
      else
        response = @message.errors
      end


      respond_to do |format|
        format.json { render :json => response, :callback => params[:callback] }
      end
    end

    def destroy
      @message = Message.find(params[:id])
      if @message.destroy
        response = {:success => true}
      else
        response = @message.errors
      end

      respond_to do |format|
        format.json { render :json => response, :callback => params[:callback] }
      end
    end

  end

end