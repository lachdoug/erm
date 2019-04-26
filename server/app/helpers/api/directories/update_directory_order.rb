class Server
  module App
    module Helpers

      def update_directory_order( dir_path, dir_config, dir_params )

        dir_params ||= {}

        dir_data = load_dir_data dir_path
        order = dir_params[:order] || []

        order.each.with_index do | entry_id, i |
          dir_data[ entry_id.to_i ] ||= {}
          dir_data[ entry_id.to_i ][:order] = i + 1
        end

        save_dir_data dir_path, dir_data

        {
          type: :update_dir_order,
          path: URI.encode( "#{ dir_path }/~dir" )
        }

      rescue Errno::ENOENT

        name = dir_path.match( /([^\/]+)$/ )
        raise ApiError.new( "#{ name } does not exist.", 404 )

      end

    end
  end
end