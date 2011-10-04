source "http://rubygems.org"

group :development do
  # include gems from test app
  datajam_gemfile = File.expand_path('../spec/datajam/Gemfile', __FILE__)
  datajam_gems = File.read(datajam_gemfile) rescue nil
  eval datajam_gems if datajam_gems
end

gemspec
