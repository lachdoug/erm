class Server
  module App
    module Helpers

      def list_directory_entries( dir_path )

        Dir.glob( "#{ dir_path }/*" ).
        select { |entry| File.directory?( entry ) || File.file?( entry ) }

      end

    end
  end
end
