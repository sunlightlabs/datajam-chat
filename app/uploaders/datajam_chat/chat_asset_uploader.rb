class DatajamChat::ChatAssetUploader < CarrierWave::Uploader::Base
  require 'uuidtools'
  require 'mime/types'

  storage :grid_fs

  def filename
    if original_filename
      @name ||= Digest::MD5.hexdigest(File.dirname(current_path))
      "#{@name}.#{file.extension}"
    end
  end

  def store_dir
    "chat_assets"
  end

  def extension_white_list
    %w(png jpg jpeg gif bmp)
  end


end
