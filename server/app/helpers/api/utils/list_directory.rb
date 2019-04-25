class Server
  module App
    module Helpers

      def list_directory( dir_path, options={} )

        Dir.glob( "#{ dir_path }/*" ).
          map { |entry|
            if File.file?( entry )
              if options[:index_files]
                index = File.basename( entry, '.*' ).to_i
                [ 1, index, entry ]
              else
                name = File.basename( entry ).downcase
                [ 1, name, entry ]
              end
            else
              if options[:index_dirs]
                index = File.basename( entry ).to_i
                [ 0, index, entry ]
              else
                name = File.basename( entry ).downcase
                [ 0, name, entry ]
              end
            end
          }.
          sort_by { |entry| [ entry[0], entry[1] ] }.
          map { |entry| entry[2] }.
          select { |entry| File.directory?( entry ) || File.file?( entry ) }.
          map { |entry|  block_given? ? yield(entry) : entry }

      end

    end
  end
end
