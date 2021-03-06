class Server < Sinatra::Base

  before do
    if request.path_info.match /^\/api\/?|^\/iframe\/?|^\/download\/?/
      authenticate! unless request.path_info === "/api/session" &&
                            request.request_method === "POST"
    end
  end

  def authenticate!
    raise Error.new( "Not signed in.", 401 ) unless signed_in
    if timed_out
      session.delete( :user_auth_at )
      session.delete( :user_token )
      raise Error.new( "Signed out due to inactivity.", 401 )
    else
      session[:user_auth_at] = Time.now
    end
  end

  def sign_out
    session[:user_auth_at] = false
    "Signed out"
  end

  def sign_in( token )
    raise Error.new( "User token has not been set.", 500 ) unless settings.user_token
    if token === settings.user_token
      session[:user_auth_at] = Time.now
      session[:user_token] = token
      "Signed in."
    else
      session[:user_auth_at] = false
      raise Error.new( "Failed to sign in.", 401 )
    end
  end

  def timed_out
    inactivity_seconds = Time.now.to_i - session[:user_auth_at].to_i
    inactivity_seconds > settings.user_inactivity_timeout
  end

  def signed_in
    session[:user_auth_at] && ( settings.user_token === session[:user_token] )
  end

end
