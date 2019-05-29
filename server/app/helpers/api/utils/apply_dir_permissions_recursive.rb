class Server
  module App
    module Helpers

      def apply_dir_permissions_recursive( dir_path )

        Dir.glob( "#{ dir_path }/*" ).each do |entry|
          if File.directory?( entry )
            apply_dir_permissions( entry )
          elsif File.file?( entry )
            apply_file_permissions( entry )
          end
        end

      end

    end
  end
end
