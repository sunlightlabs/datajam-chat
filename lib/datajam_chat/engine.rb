require 'rails/engine'
require 'datajam_chat'

module DatajamChat
  class Engine < Rails::Engine
    #
    # config.generators do |g|
    #   g.orm :mongoid
    #   g.template_engine :erb
    #   g.test_framework :rspec
    # end

    # config.mongoid do |m|
    #   m.observers = :message_observer
    # end

    initializer "datajam_chat.load_defaults" do |app|
      DatajamChat.setup do |engine|
        engine.config = YAML.load_file(File.expand_path("../../../config/defaults.yml", __FILE__))[Rails.env]
      end
    end

    if Rails.env =~ /^(development|test)$/
      initializer "datajam_chat.static_assets" do |app|
        app.middleware.use ::ActionDispatch::Static, "#{root}/app/assets"
      end
    end

  end
end
