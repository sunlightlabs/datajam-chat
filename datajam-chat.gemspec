$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "datajam/chat/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "datajam-chat"
  s.version     = Datajam::Chat::VERSION
  s.authors     = ["Dan Drinkard"]
  s.email       = ["ddrinkard@sunlightfoundation.com"]
  s.homepage    = "http://datajam.org"
  s.summary     = "A real-time chat engine for datajam."
  s.description = File.open(File.expand_path("../README.md", __FILE__)).read rescue nil

  s.files = Dir["{app,config,db,lib,public}/**/*"] + ["LICENSE.md", "Rakefile", "README.md"]

  s.add_dependency "facets", "~> 2.9"
  s.add_dependency 'bitly', '~> 0.6'
  s.add_dependency 'formatize', '~> 1.0'

  s.add_development_dependency 'vcr', '~> 1.6.0'
  s.add_development_dependency 'fakeweb', '~> 1.3.0'
  s.add_development_dependency 'debugger'
  s.add_development_dependency 'jasmine'
  s.add_development_dependency 'httparty'
  s.add_development_dependency 'fuubar'
end
