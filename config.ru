require 'sinatra/base'
require 'sinatra/extension'
require 'sinatra/json'
require 'byebug' if Sinatra::Base.development?

require './server'
map('/') { run Server }
