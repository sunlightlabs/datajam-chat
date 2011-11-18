require "active_support/dependencies"

module DatajamChat

  mattr_accessor :app_root

  def self.setup
    yield self
  end

  def self.sessions
    @@sessions ||= Redis::Namespace.new((Rails.env + '_chat_sessions').to_sym, :redis => Redis.new)
  end

  def self.bitly
    @@bitly ||= Bitly.new('dandrinkard', 'R_d8607321607aef1915a1d1a8ff0312bf')
  end

  def self.config
    @@config ||= {}
  end

  def self.config=(hash)
    @@config ||= {}
    @@config.update hash
  end

end

require "datajam_chat/engine"
