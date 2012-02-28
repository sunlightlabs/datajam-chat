module DatajamChat
  module UninstallJob

    def self.perform
      # Delete all installed assets from GridFS
      fs = Mongo::GridFileSystem.new(Mongoid.database)
      Dir.glob("#{DatajamChat::Engine.root}/public/**/*.*") do |filepath|
        filename = filepath.gsub("#{DatajamChat::Engine.root}/public/", '')
        fs.delete(filename)
      end
      # Remove ChatArea instances from events
      Event.all.each do |event|
        event.content_areas.where(:area_type => 'chat_area').destroy_all
      end
      # Remove settings
      Setting.where(:namespace => 'datajam_chat').destroy_all
      Datajam::Settings.flush(:datajam_chat)
    end
  end
end