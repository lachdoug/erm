class Server
  module App
    module Helpers

      def build_static_dirs( dir, dir_config )

        touch_directory "#{ Server.fs_dir }/#{ dir }"

        if dir_config[:dirs].is_a? Array
          dir_config[:dirs].each do |subdir_config|
            dir_path = "#{ dir }/#{ subdir_config[:name] }"
            entry_path = "#{ Server.fs_dir }/#{ dir_path }"
            touch_directory entry_path
            apply_dir_permissions entry_path
            build_static_dirs "#{ dir_path }/", subdir_config
          end
        end

        if dir_config[:files].is_a? Array
          dir_config[:files].each do |file_config|
            file_path = "#{ dir }/#{ file_config[:name] }#{
              file_config[:ext] ? ".#{ file_config[:ext] }" : '' }"
            entry_path = "#{ Server.fs_dir }/#{ file_path }"
            touch_file entry_path
            apply_file_permissions entry_path
          end
        end

      end

    end
  end
end
