module DatajamChat
  module ClearSessionsJob

    def self.perform
      DatajamChat.sessions.keys.each { |key| DatajamChat.sessions.del(key) }
    end
  end
end