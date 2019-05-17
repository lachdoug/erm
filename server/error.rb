class Server < Sinatra::Base

  class Error < StandardError

    attr_reader :status, :message

    def initialize( message, status )
      @message = message
      @status = status
    end

  end
  
end
