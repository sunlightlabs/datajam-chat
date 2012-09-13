namespace :chat do
  desc "Install Chat"
  task :install => :environment do
    Datajam::Chat::InstallJob.perform
  end

  desc "Uninstall Chat"
  task :uninstall => :environment do
    Datajam::Chat::UninstallJob.perform
  end

  desc "Refresh static assets"
  task :refresh_assets => :environment do
    Datajam::Chat::RefreshAssetsJob.perform
  end

  desc "Clear the redis session cache"
  task :clear_sessions => :environment do
    Datajam::Chat::ClearSessionsJob.perform
  end

  desc "Recache all chat endpoints"
  task :cache_reset => :environment do
    Datajam::Chat::CacheResetJob.perform
  end

  desc "Concatenate and compile the backbone app after making changes"
  task :build_javascripts do
    require 'httparty'
    require 'active_support/core_ext'

    manifest = File.open(File.expand_path('../../../.javascripts-manifest', __FILE__), 'r')
    dir = File.expand_path('../../../public/javascripts/datajam', __FILE__)
    build = File.open("#{dir}/chat/application-compiled.js", "w+")

    build.puts <<-EOT.strip_heredoc
      /**
       * Datajam Chat build file
       * Do not edit this file directly -- run `rake chat:build`
       */

      (function($, define, require){

    EOT

    while (line = manifest.gets)
      build.puts(File.open("#{dir}/#{line.chomp}").read.sub("define([", "define('#{line.chomp.sub('.js', '')}', ["))
    end

    build.puts <<-EOT.strip_heredoc
      })(jQuery, define, require);
    EOT

    build.rewind
    code = build.read
    build.close

    compiled = HTTParty::post(
      'http://closure-compiler.appspot.com/compile',
      :body => {
        compilation_level: 'SIMPLE_OPTIMIZATIONS',
        output_format: 'text',
        output_info: 'compiled_code',
        js_code: code
        })

    if compiled.strip === ''
      raise 'Unable to build with closure compiler. Please ensure your syntax is correct.'
    end


    File.open("#{dir}/chat/application-compiled.min.js", "w+") do |file|
      file.print compiled
    end

    puts 'JS Assets compiled and minified'

  end
end