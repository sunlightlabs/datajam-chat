module DatajamChat
  module CacheresetJob

    def self.perform
      Chat.all.entries.each do |chat|
        chat.cache_reset!
      end
    end
  end
end