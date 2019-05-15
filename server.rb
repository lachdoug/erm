class Server < Sinatra::Base

  puts "Development? #{ Sinatra::Base.development? }"

  require './server/app'

  helpers App::Helpers

  set sessions: true,
      logging: Sinatra::Base.development?,
      dump_errors: Sinatra::Base.development?,
      show_exceptions: false,
      env_template_params: YAML.load( ENV['ERM_TEMPLATE_PARAMS_YAML'] || '' ) || {},
      fs_dir: ENV['ERM_FS_DIR'] ||
        ( Sinatra::Base.development? ? "volumes" : "home/fs" )

  FileUtils.cp_r "data/config/.", "config"
  FileUtils.cp_r "data/public/.", "public"

  App::Controllers.configure_erm
  register App::Controllers

  before do
    # Default content type to JSON
    if request.path_info.match /^\/api\/?/
      content_type :json
      body = request.body.read
      params.merge!( JSON.parse( body ) ) unless body.empty?
    end
  end

  after do
    if content_type === "application/json"
      response.body = JSON.pretty_generate( response.body )
    end
  end

  class ApiError < StandardError

    attr_reader :status, :message

    def initialize( message, status )
      @message = message
      @status = status
    end

  end

  not_found do
    # Return index.html on all GETs, unless api/ or iframe/ call
    pass if request.path_info.match /^\/vendor\/?|^\/assets\//
    if request.path_info.match /^\/api\/?|^\/iframe\/?/
      content_type :text
      "Server route not found."
    else
      pass unless request.request_method === "GET"
      status 200
      erb :'index.html'
    end
  end

  error ApiError do |e|
    content_type :text
    status e.status
    e.message
  end

  error do |e|
    content_type :text
    "Server error ( #{ e.backtrace[0].split('/').last } #{ e.to_s } )."
  end

end
