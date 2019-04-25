require 'sinatra/base'
require 'sinatra/extension'
require 'sinatra/json'
# require "sinatra/activerecord/rake"
require 'byebug' if Sinatra::Base.development?

require 'yaml'

require "./server"

# require './server/app'
# register App::Controllers
# helpers App::Helpers

Dir.glob( './tasks/**/*.rake' ).each { |file| load file }

# load "./tasks/release.rake"

task default: [:client]

# task :build do
#   puts "Rake OK"
# end
