Rails.application.routes.draw do

  scope :module => :datajam_chat do

    post 'chats/identity' => 'identity#create'
    post 'chats/identity/destroy' => 'identity#destroy'
    get 'chats/identity' => 'identity#show'

    post 'chats/upload' => 'message_assets#create'

    resources :chats do
      resources :messages
      resources :chat_pages
    end

  end

end
