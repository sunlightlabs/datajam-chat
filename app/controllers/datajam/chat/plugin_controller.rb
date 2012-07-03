module Datajam
  module Chat
    class PluginController < ::ApplicationController
      before_filter :authenticate_user!

      def install
        begin
          Datajam::Chat::InstallJob.perform
          flash[:notice] = "Plugin installed."
          redirect_to plugin_settings_path('datajam-chat')
        rescue
          flash[:error] = "Failed to install plugin: #{$!}"
          redirect_to admin_plugins_path
        end
      end

      def uninstall
        begin
          Datajam::Chat::UninstallJob.perform
          flash[:notice] = "Plugin uninstalled."
          redirect_to admin_plugins_path
        rescue
          flash[:error] = "Failed to uninstall plugin: #{$!}"
          redirect_to plugin_settings_path('datajam-chat')
        end
      end

      def refresh_assets
        begin
          Datajam::Chat::RefreshAssetsJob.perform
          flash[:notice] = "Assets refreshed."
        rescue
          flash[:error] = "Failed to refresh assets: #{$!}"
        end
        redirect_to plugin_settings_path('datajam-chat')
      end

      def clear_sessions
        begin
          Datajam::Chat::ClearSessionsJob.perform
          flash[:notice] = "Chat sessions cleared."
        rescue
          flash[:error] = "Failed to clear sessions: #{$!}"
        end
        redirect_to plugin_settings_path('datajam-chat')
      end
    end
  end
end
