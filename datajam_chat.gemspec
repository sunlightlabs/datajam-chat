$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "datajam_chat/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "datajam_chat"
  s.version     = DatajamChat::VERSION
  s.authors     = ["Dan Drinkard"]
  s.email       = ["ddrinkard@sunlightfoundation.com"]
  s.homepage    = "http://datajam.org"
  s.summary     = "Pluggable real-time chat for datajam"
  s.description = "Datajam is a CMS for live event management"

  s.files = Dir["{app,config,db,lib}/**/*"] + ["LICENSE", "Rakefile", "README.md"]

  s.add_dependency "rack", "1.3.3"
  s.add_dependency "rails", "~> 3.1.0"
  s.add_dependency "jquery-rails", '~> 0.2'
  s.add_dependency 'mongoid', '~> 2.0'
  s.add_dependency 'bson_ext', '~> 1.2'
  s.add_dependency 'carrierwave', '~> 0.5'
  s.add_dependency 'carrierwave-mongoid', '~> 0.1.3'
  s.add_dependency 'mongoid_slug', '~> 0.7'
  s.add_dependency 'rack-gridfs', '~> 0.4'

end