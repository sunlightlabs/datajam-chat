desc "Install default settings"
task :install => :environment do
  DatajamChat::Engine.load_seed
end
