# Do gnarly things to rake for heroku
pt = Rake::Task['assets:environment']
Rake.application.send(:eval, "@tasks.delete('assets:environment')")

namespace :assets do
  task :environment do
    module ::Mongoid
      def load!(config_file)
        puts "Skipping connection to Mongo DB"
      end
    end

    pt.execute
  end
end

namespace :datajam_chat do
  desc "Install default settings"
  task :install => :environment do
    DatajamChat::Engine.load_seed
  end
end