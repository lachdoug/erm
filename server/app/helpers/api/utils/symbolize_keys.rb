class Server
  module App
    module Helpers

      def symbolize_keys( data )

        JSON.parse( data.to_json, symbolize_names: true)

        # if data.is_a? Array
        #   data.map! do |datum|
        #     symbolize_keys( datum )
        #   end
        # elsif data.is_a? Hash
        #   data = data.transform_keys &:to_sym
        # end
        #
        # data

      end

    end
  end
end
