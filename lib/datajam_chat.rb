require "active_support/dependencies"
require "datajam_chat/engine"

module DatajamChat

  mattr_accessor :app_root

  def self.setup
    yield self if block_given?
  end

  def self.sessions
    @@sessions ||= Redis::Namespace.new((Rails.env + '_chat_sessions').to_sym, :redis => ::REDIS)
  end

  def self.bitly
    @@bitly ||= Bitly.new(Datajam::Settings[:datajam_chat][:bitly_username], Datajam::Settings[:datajam_chat][:bitly_api_key])
  end

  def self.install_required?
    true
  end

  def self.installed?
    Datajam::Settings[:datajam_chat].any?
  end

  def self.install
    # Copy files to GridFS
    fs = Mongo::GridFileSystem.new(Mongoid.database)
    Dir.glob("#{DatajamChat::Engine.root}/public/**/*.*") do |filepath|
      filename = filepath.gsub("#{DatajamChat::Engine.root}/public/", '')
      fs.open(filename, 'w', :delete_old => true) do |f|
        f.write(File.open(filepath))
      end
    end
    # install settings
    DatajamChat::Engine.load_seed
  end

  def self.uninstall
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

  def self.clear_sessions
    DatajamChat.sessions.keys.each { |key| DatajamChat.sessions.del(key) }
  end

end