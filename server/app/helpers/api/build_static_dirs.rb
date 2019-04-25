class Server
  module App
    module Helpers

      def build_static_dirs( dir, dir_config )

        touch_directory "#{ Server.fs_dir }/#{ dir }"

        if dir_config[:dirs].is_a? Array
          dir_config[:dirs].each do |subdir_config|
            touch_directory "#{ Server.fs_dir }/#{ dir }/#{ subdir_config[:name] }"
            build_static_dirs "#{ dir }/#{ subdir_config[:name] }/", subdir_config
          end
        end

        if dir_config[:files].is_a? Array
          dir_config[:files].each do |file_config|
            touch_file "#{ Server.fs_dir }/#{ dir }/#{ file_config[:name] }#{
              file_config[:ext] ? ".#{ file_config[:ext] }" : '' }"
          end
        end

      end

    end
  end
end
