namespace :datajam_chat do
  desc "Install default settings for Chat"
  task :install_settings => :environment do
    DatajamChat::Engine.load_seed
  end

  desc "Install static files for Chat"
  task :install_assets do
    FileUtils.cp_r("#{DatajamChat::Engine.root}/app/assets/images/datajam_chat/", "#{Rails.root}/public/images")
    FileUtils.cp_r("#{DatajamChat::Engine.root}/app/assets/javascripts/datajam_chat/", "#{Rails.root}/public/javascripts")
    FileUtils.cp_r("#{DatajamChat::Engine.root}/app/assets/stylesheets/datajam_chat/", "#{Rails.root}/public/stylesheets")
  end

  desc "Uninstall settings for Chat"
  task :uninstall_settings => :environment do
    Setting.where(:namespace => 'datjam_chat').destroy_all
  end

  desc "Uninstall static files for Chat"
  task :uninstall_assets do
    FileUtils.rm_r("#{Rails.root}/public/images/datajam_chat", :force => true)
    FileUtils.rm_r("#{Rails.root}/public/javascripts/datajam_chat", :force => true)
    FileUtils.rm_r("#{Rails.root}/public/stylesheets/datajam_chat", :force => true)
  end
end