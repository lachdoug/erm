class Server
  module App
    module Controllers

      post "/api/session" do
        sign_in params[:token]
      end

      delete "/api/session" do
        sign_out
      end

    end
  end
end
