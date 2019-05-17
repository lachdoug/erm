namespace :client do

  task :build, [ :version ] do | task, args |
    @distribution = Server::App::Services::Distribution.new
    @distribution.process
  end

end
