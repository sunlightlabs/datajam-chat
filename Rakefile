#!/usr/bin/env rake
require "bundler/gem_tasks"
require "rspec/core/rake_task"
require "rails"

Dir["lib/tasks/*.rake"].each {|ext| load ext } if defined?(Rake)

desc 'Default: run specs.'
task :default => :spec

desc "Run specs"
RSpec::Core::RakeTask.new do |t|
  t.pattern = "./spec/{acceptance,controllers,models}/**/*_spec.rb"
end
