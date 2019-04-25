class Server
  module App
    module Helpers

      def as_map( type )

        return nil unless type

        map = {
          md: 'markdown',
          json: 'list',
          yaml: 'list',
          js: 'code',
          rb: 'code',
          sh: 'code',
          py: 'code',
        }.merge( config[:as_map] || {} )

        map[ type.to_sym ] || type.to_s

      end

    end
  end
end
