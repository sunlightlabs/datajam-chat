module Datajam::Chat::ClearSessionsJob
  def self.perform
    Chat.sessions.keys.each { |key| Chat.sessions.del(key) }
  end
end
