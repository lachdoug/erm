class Server
  module App
    module Services
      class Distribution

        require 'uglifier'

        def process
          puts "Building client.js"
          File.write( "public/client.js", client )
          File.write( "public/client.min.js", client_min )
        end

        def client
          concatenate( [ './client/**/*.js' ] )
        end

        def client_min
          minify client
        end

        def concatenate( sources )
          ["'use strict'"].tap do |result|
            sources.each do |source|
              files_from( source ).each do |file|
                result << File.read( file )
              end
            end
          end.join("\n")
        end

        def minify( javascript )
          Uglifier.compile javascript, harmony: true
        end

        def files_from( source )
          Dir.glob( [ source ] ).select { |file| puts file; File.file?(file) }.sort{ |a, b| a.count('/') <=> b.count('/') }
        end

      end
    end
  end
end
