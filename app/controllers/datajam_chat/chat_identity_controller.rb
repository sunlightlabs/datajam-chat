class DatajamChat::ChatIdentityController < DatajamChat::EngineController

  before_filter :set_cache_buster, :only => [:index]
  
  # Gets current user's display name
  def index
    if current_user
      session[:display_name] = current_user.name
    end
    respond_to do |format|
      format.json { render :json => display_name, :callback => params[:callback] }
    end
  end

  # Identifies an anonymous user by session ID
  def create
    # registered users' names are reserved;
    # we can assume their name is their display name always
    if current_user
      session[:display_name] = current_user.name
      response = display_name
    else
      current_name = params[:display_name].slice(0,30)
      # is the name reserved?
      unless current_name.blank?
        already_registered_users = User.where(:name => current_name)
        if already_registered_users.any?
          response = error_name_taken
        else # is an anonymous user already using this name?
          if DatajamChat.sessions.get(current_name).blank? or DatajamChat.sessions.get(current_name) == session[:session_id]
            DatajamChat.sessions.set current_name, session[:session_id]
            session[:display_name] = current_name
            response = display_name
          else
            response = error_name_taken
          end
        end
      else
        response = error_name_blank
      end
    end

    respond_to do |format|
      format.json { render :json => response, :callback => params[:callback] }
    end
  end

  # Deletes the current user's display name
  def destroy
    if DatajamChat.sessions.get(params[:display_name]) == session[:session_id]
      DatajamChat.sessions.del(params[:display_name])
    end
    session[:display_name] = nil
    respond_to do |format|
      format.json { render :json => display_name, :callback => params[:callback] }
    end
  end

  protected

  def error_name_taken
    {:errors => ['Name is already registered, please choose another']}
  end

  def error_name_blank
    {:errors => ['You must supply a display name']}
  end

  def display_name
    {:display_name => (session[:display_name] rescue nil), :is_admin => current_user ? true : false }
  end

  def set_cache_buster
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end

end
