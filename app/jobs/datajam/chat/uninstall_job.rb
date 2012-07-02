module Datajam::Chat::UninstallJob
  def self.perform
    # Delete all installed assets from GridFS
    fs = Mongo::GridFileSystem.new(Mongoid.database)
    Dir.glob("#{Datajam::Chat::Engine.root}/public/**/*.*") do |filepath|
      filename = filepath.gsub("#{Datajam::Chat::Engine.root}/public/", '')
      fs.delete(filename)
    end
    # Remove ChatArea instances from events
    Event.all.each do |event|
      event.content_areas.where(:area_type => 'chat_area').destroy_all
    end
    # Remove settings
    Setting.where(:namespace => 'chat').destroy_all
    Datajam::Settings.flush(:chat)
  end
end
