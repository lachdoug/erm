class Server
  module App
    module Helpers

      def save_dir_data( path, metadata )

        contents =
        "# This file is used by #{ config[:title] || 'Engines Resource Manager' }\n" +
        "# Do not delete or move\n" +
        metadata.to_yaml

        entry_path = "#{ Server.fs_dir }/#{ path }/.erm.data"

        write_file( entry_path, contents )

        apply_file_permissions entry_path

      end

    end
  end
end
