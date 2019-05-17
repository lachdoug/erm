class Server < Sinatra::Base

  require './server/app'
  require './server/settings'
  require './server/error'
  require './server/error_filters'
  require './server/content_filters'
  require './server/authenticate'

  helpers App::Helpers
  App::Controllers.configure_erm
  register App::Controllers

end
