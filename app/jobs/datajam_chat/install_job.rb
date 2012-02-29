module DatajamChat::InstallJob

  def self.perform
    # install assets
    DatajamChat::RefreshAssetsJob.perform
    # install settings
    DatajamChat::Engine.load_seed
  end
end