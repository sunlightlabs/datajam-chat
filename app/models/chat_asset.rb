class ChatAsset

  include Mongoid::Document
  include Mongoid::Timestamps

  mount_uploader :chat_asset, DatajamChat::ChatAssetUploader,   mount_on: :asset_filename

  validates_presence_of :chat_asset

  before_destroy do
    remove_chat_asset!
  end

end
