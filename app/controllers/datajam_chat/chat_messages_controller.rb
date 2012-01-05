class DatajamChat::ChatMessagesController < DatajamChat::EngineController

  before_filter :authenticate_user!, :except => [:create]

  def index
    @chat = Chat.find(params[:chat_id])
    @limit =  params[:limit] ? params[:limit].to_i : Datajam::Settings[:datajam_chat][:page_size].to_i
    unless params[:status]
      @incoming = @chat.incoming_messages.limit @limit
      @approved = @chat.approved_messages.limit @limit
      @rejected = @chat.rejected_messages.limit @limit
    else
      @messages = @chat.send("#{params[:status]}_messages".to_sym).limit(@limit)
    end

    respond_to do |format|
      format.json { render :json => locals, :callback => params[:callback] }
    end
  end

  def create
    @chat = Chat.find(params[:chat_id])
    @message = ChatMessage.new(JSON.parse(params[:model]))
    @message.chat_id = @chat.id

    if current_user
      @message.user = current_user
      @message.display_name = current_user.name
      @message.is_public = true
      @message.is_moderated = true
    elsif session[:display_name]
      @message.display_name = session[:display_name]
    else
      @message = nil
      response = {:errors => "You need to be identified to post"}
    end

    if @message && @message.save
      response = @message.as_json
    elsif @message
      response = {:errors => @message.errors}
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

  def update
    @message = ChatMessage.find(params[:id])

    if @message.update_attributes(JSON.parse(params[:model]).keep_if {|key, val| writable_attrs.include? key.to_sym})
      # make sure we re-paginate this message if it already has a page assigned
      if @message.page
        @message.repaginate!
      end
      response = @message
    else
      response = @message.errors
    end


    respond_to do |format|
      format.json { render :json => response, :callback => params[:callback] }
    end
  end

  def writable_attrs
    [:text, :is_public, :is_moderated]
  end

  # def destroy
  #   @message = ChatMessage.find(params[:id])
  #   if @message.destroy
  #     response = {:success => true}
  #   else
  #     response = @message.errors
  #   end
  #
  #   respond_to do |format|
  #     format.json { render :json => response, :callback => params[:callback] }
  #   end
  # end

end
