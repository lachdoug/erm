namespace :client do

  task :build, [ :version ] do | task, args |
    @distribution = Server::App::Models::Distribution.new
    @distribution.process
  end

end
