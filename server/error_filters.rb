class Server < Sinatra::Base

  not_found do
    content_type :text
    "Server route not found."
  end

  error Error do |e|
    content_type :text
    status e.status
    e.message
  end

  error do |e|
    content_type :text
    "Server error ( #{ e.backtrace[0].split('/').last } #{ e.to_s } )."
  end

end
