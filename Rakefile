#!/usr/bin/env rake
require "bundler/gem_tasks"
require "rspec/core/rake_task"

require File.expand_path('../spec/datajam/config/application', __FILE__)
require 'rake'
Datajam::Application.load_tasks

Dir["lib/tasks/*.rake"].each {|ext| load ext } if defined?(Rake)

desc 'Default: run specs.'
task :default => :spec

desc "Run specs"
RSpec::Core::RakeTask.new do |t|
  t.pattern = "./spec/{,*/}*_spec.rb"
end
