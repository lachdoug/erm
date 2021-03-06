class Server
  module App
    module Helpers

      def show_raw_file( behavior, file_path, file_config )

        # entry_path = "#{ Server.fs_dir }/#{ file_path }"
        entry_path = file_path

        entry = file_entry behavior, file_path, file_config

        content = read_file entry_path

        entry[:view] = :raw_file
        entry[:content] = content

        entry

      end

    end
  end
end
