class Server < Sinatra::Base

  before do
    if request.path_info.match /^\/api\/?|^\/iframe\/?/
      authenticate! unless request.path_info === "/api/session"
    end
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

end
