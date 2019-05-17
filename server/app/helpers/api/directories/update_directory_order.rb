class Server
  module App
    module Helpers

      def update_directory_order( dir_path, dir_config, dir_params )

        dir_params ||= {}

        dir_data = load_dir_data dir_path
        order = dir_params[:order] || []

        order.each.with_index do | name, i |
          dir_data[ name ] ||= {}
          dir_data[ name ][:order] = i + 1
        end

        save_dir_data dir_path, dir_data

        {
          view: :update_dir_order,
          path: "#{ dir_path }/~dir"
        }

      rescue Errno::ENOENT

        name = dir_path.match( /([^\/]+)$/ )
        raise Error.new( "#{ name } does not exist.", 404 )

      end

    end
  end
end
