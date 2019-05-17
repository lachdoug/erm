class Server < Sinatra::Base

  set sessions: true,
      logging: Sinatra::Base.development?,
      dump_errors: Sinatra::Base.development?,
      show_exceptions: false,
      env_template_params: YAML.load( ENV['ERM_TEMPLATE_PARAMS_YAML'] || '' ) || {},
      user_token: ENV['ERM_USER_TOKEN'] ||
        ( Sinatra::Base.development? ? "123" : null ),
      user_inactivity_timeout: ( ( ENV['ERM_USER_INACTIVITY_TIMEOUT'] || 30 ).to_i * 60 )

  FileUtils.cp_r "data/config/.", "config"
  FileUtils.cp_r "data/public/.", "public"

end
