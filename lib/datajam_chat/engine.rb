require 'rails/engine'
require 'sprockets/railtie'
require 'datajam_chat'
require 'bitly'

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

    initializer "datajam_chat.register_plugin" do
      Datajam.setup do |app|
        app.plugins << Gem::Specification.load(File.expand_path("../../../datajam_chat.gemspec", __FILE__))
      end
    end

    initializer "datajam.precompile_everything" do
      Datajam.setup do |app|
        app.assets.precompile += %w( *.js *.css )
      end
    end

    initializer "bitly.use_api_version_3" do
      Bitly.use_api_version_3
    end

    if Rails.env =~ /^(development|test)$/
      initializer "datajam_chat.static_assets" do |app|
        app.middleware.use ::ActionDispatch::Static, "#{root}/app/assets"
      end
    end


  end
end
