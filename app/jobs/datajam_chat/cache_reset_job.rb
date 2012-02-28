module DatajamChat::CacheResetJob

  def self.perform
    Chat.all.entries.each do |chat|
      chat.cache_reset!
    end
  end
end