class MessageAsset

  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :message

  mount_uploader :message_asset, MessageAssetUploader, mount_on: :asset_filename

end
