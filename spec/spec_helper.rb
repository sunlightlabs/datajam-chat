ENV['RAILS_ENV'] = 'test'
require File.expand_path('../datajam/config/environment.rb', __FILE__)
require 'rspec/rails'

Rails.backtrace_cleaner.remove_silencers!

require 'database_cleaner'
DatabaseCleaner.strategy = :truncation

ENGINE_RAILS_ROOT=File.join(File.dirname(__FILE__), '../')
Dir[File.join(ENGINE_RAILS_ROOT, "spec/support/**/*.rb")].each {|f| require f }

RSpec.configure do |config|
  config.include Mongoid::Matchers
  config.mock_with :rr

  config.before(:each) do
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end

end
