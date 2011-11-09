class MessageAssetUploader < CarrierWave::Uploader::Base
  require 'UUIDTools'

  def filename
    ext = self.to_s.split(/\./).slice(-1)
    "#{UUIDTools::UUID.timestamp_create.to_s}.#{ext}"
  end

  def store_dir
    "message_assets"
  end

  def extension_white_list
    %w(png jpg jpeg gif bmp)
  end


end
