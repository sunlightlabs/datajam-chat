namespace :datajam_chat do
  desc "Install Datajam Chat"
  task :install => :environment do
    DatajamChat::Engine.load_seed
    FileUtils.cp_r("#{DatajamChat::Engine.root}/app/assets/images/datajam_chat/", "#{Rails.root}/public/images")
    FileUtils.cp_r("#{DatajamChat::Engine.root}/app/assets/javascripts/datajam_chat/", "#{Rails.root}/public/javascripts")
    FileUtils.cp_r("#{DatajamChat::Engine.root}/app/assets/stylesheets/datajam_chat/", "#{Rails.root}/public/stylesheets")
  end

  desc "Uninstall Datajam Chat"
  task :uninstall => :environment do
    Setting.where(:namespace => 'datjam_chat').destroy_all
    FileUtils.rm_r("#{Rails.root}/public/images/datajam_chat")
    FileUtils.rm_r("#{Rails.root}/public/javascripts/datajam_chat")
    FileUtils.rm_r("#{Rails.root}/public/stylesheets/datajam_chat")
  end
end