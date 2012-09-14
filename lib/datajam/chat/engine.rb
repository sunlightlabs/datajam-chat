require 'rails/engine'
require 'bitly'

module Datajam
  module Chat
    class Engine < Rails::Engine
      initializer "datajam-chat.register_plugin" do
        Datajam.setup do |app|
          gemspec = File.expand_path("../../../../datajam-chat.gemspec", __FILE__)
          app.plugins << Gem::Specification.load(gemspec)
        end
      end

      initializer "bitly.use_api_version_3" do
        Bitly.use_api_version_3
      end

      if Rails.env =~ /^(development|test)$/
        initializer "datajam-chat.static_assets" do |app|
          app.middleware.use ::ActionDispatch::Static, "#{root}/public"
        end
      end
    end

  end
end
