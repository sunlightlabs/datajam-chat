module Datajam
  module Chat
    module ClearSessionsJob
      def self.perform
        Datajam::Chat.sessions.keys.each { |key| Datajam::Chat.sessions.del(key) }
      end
    end
  end
end
