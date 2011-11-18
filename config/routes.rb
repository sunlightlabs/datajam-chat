Rails.application.routes.draw do

  scope :module => :datajam_chat do

    scope '/chats' do
      resources :identity, :controller => 'chat_identity', :only => [:index, :create]
      delete '/identity' => 'chat_identity#destroy'

      resources :upload, :controller => 'chat_assets', :only => [:create]
      delete '/upload' => 'chat_assets#destroy'
    end

    resources :chats, :only => [:index, :show] do
      resources :messages, :controller => 'chat_messages', :except => [:new, :edit, :destroy]
      resources :pages, :controller => 'chat_pages', :only => [:show]
    end

  end

  namespace :admin do
    resources :chats
  end

end
