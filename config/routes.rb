Rails.application.routes.draw do

  scope :module => :chat do

    scope '/chats' do
      resources :identity, :controller => 'chat_identity', :only => [:index, :create]
      delete '/identity' => 'chat_identity#destroy'

      resources :upload, :controller => 'chat_assets', :only => [:create]
      delete '/upload' => 'chat_assets#destroy'
    end

    resources :chats, :controller => 'chat_threads', :only => [:index, :show, :update] do
      resources :messages, :controller => 'chat_messages', :except => [:new, :edit, :destroy]
      resources :pages, :controller => 'chat_pages', :only => [:show]
    end

    scope '/admin/plugins/chat' do
      get '/install' => 'plugin#install'
      get '/uninstall' => 'plugin#uninstall'
      get '/refresh_assets' => 'plugin#refresh_assets'
      get '/clear_sessions' => 'plugin#clear_sessions'
    end

  end

  namespace :admin do
    resources :chats, :controller => 'chat_threads'
  end

end
