$:.push File.expand_path("../lib", __FILE__)

require "datajam/chat/version"

Gem::Specification.new do |gem|
  gem.name          = "datajam-chat"
  gem.version       = Datajam::Chat::VERSION
  gem.authors       = ["Sunlight Labs", "Dan Drinkard"]
  gem.email         = ["ddrinkard@sunlightfoundation.com"]
  gem.homepage      = "http://datajam.org"
  gem.summary       = "A real-time chat engine for Datajam."
  gem.description   = File.open(File.expand_path("../README.md", __FILE__)).read rescue nil
  gem.files         = Dir["{app,config,db,lib,public}/**/*"] + ["LICENSE.md", "Rakefile", "README.md", ".javascripts-manifest"]
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]

  gem.add_dependency 'facets', '~> 2.9'
  gem.add_dependency 'bitly', '~> 0.6'
  gem.add_dependency 'formatize', '~> 1.0'
  gem.add_dependency 'hashie'
  gem.add_development_dependency 'vcr', '~> 1.6.0'
  gem.add_development_dependency 'fakeweb', '~> 1.3.0'
  gem.add_development_dependency 'debugger'
  gem.add_development_dependency 'jasmine'
  gem.add_development_dependency 'httparty'
  gem.add_development_dependency 'fuubar'
end
