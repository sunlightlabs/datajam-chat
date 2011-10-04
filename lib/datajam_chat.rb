require "active_support/dependencies"

module DatajamChat

  mattr_accessor :app_root

  def self.setup
    yield self
  end

end

require "datajam_chat/engine"
