class Server
  module App
    module Helpers

      def move_entry( from, to )

        if from === to
          true
        elsif File.exist? to
          name = File.basename to
          raise ApiError.new( "#{ name } already exists.", 409 )
        else
          FileUtils.move from, to
        end

      end

    end
  end
end
