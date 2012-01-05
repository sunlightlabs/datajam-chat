namespace :datajam_chat do
  desc "Install Datajam Chat"
  task :install => :environment do
    DatajamChat::Engine.load_seed
  end

  desc "Uninstall Datajam Chat"
  task :uninstall => :environment do
    Setting.where(:namespace => 'datjam_chat').destroy_all
  end
end