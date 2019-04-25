class Server
  module App
    module Helpers

      def save_dir_data( path, metadata )

        contents =
        "# This file is used by #{ config[:title] || 'Engines Resource Manager' }\n" +
        "# Do not delete or move\n" +
        metadata.to_yaml

        write_file( "#{ Server.fs_dir }/#{ path }/.erm.data", contents )

      end

    end
  end
end
