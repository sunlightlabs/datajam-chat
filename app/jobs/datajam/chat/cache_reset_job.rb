module Datajam::Chat::CacheResetJob
  def self.perform
    ChatThread.all.entries.each do |chat|
      chat.cache_reset!
    end
  end
end
