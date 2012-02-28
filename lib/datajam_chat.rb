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

end