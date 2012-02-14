require 'rails/engine'
require "active_support/dependencies"
require 'datajam_chat'
require 'bitly'

module DatajamChat

  class Engine < Rails::Engine

    initializer "datajam_chat.register_plugin" do
      Datajam.setup do |app|
        app.plugins << Gem::Specification.load(File.expand_path("../../../datajam_chat.gemspec", __FILE__))
      end
    end

    initializer "bitly.use_api_version_3" do
      Bitly.use_api_version_3
    end

    if Rails.env =~ /^(development|test)$/
      initializer "datajam_chat.static_assets" do |app|
        app.middleware.use ::ActionDispatch::Static, "#{root}/public"
      end

      initializer "evergreen.config" do
        Evergreen.configure do |config|
          config.root = DatajamChat::Engine.root
        end
      end

    end
  end
end
