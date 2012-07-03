module Datajam
  module Chat
    module InstallJob
      def self.perform
        # install assets
        Datajam::Chat::RefreshAssetsJob.perform
        # install settings
        Datajam::Chat::Engine.load_seed
      end
    end
  end
end
