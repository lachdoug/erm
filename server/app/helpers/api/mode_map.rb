class Server
  module App
    module Helpers

      def mode_map( type )

        return nil unless type

        map = {
          md: 'markdown',
          yaml: 'yaml',
          json: 'javascript',
          js: 'javascript',
          rb: 'ruby',
          sh: 'shell',
          py: 'python',
        }.merge( config[:mode_map] || {} )

        map[ type.to_sym ] || type.to_s

      end

    end
  end
end
