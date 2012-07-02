require "active_support/dependencies"
require "datajam/chat/version"
require "datajam/chat/engine"

module Datajam
  module Chat
    mattr_accessor :app_root

    def self.setup
      yield self if block_given?
    end

    def self.sessions
      @@sessions ||= Redis::Namespace.new((Rails.env + '_chat_sessions').to_sym, :redis => ::REDIS)
    end

    def self.bitly
      @@bitly ||= Bitly.new(Datajam::Settings[:chat][:bitly_username], Datajam::Settings[:chat][:bitly_api_key])
    end

    def self.install_required?
      true
    end

    def self.installed?
      Datajam::Settings[:chat].any?
    end
  end
end