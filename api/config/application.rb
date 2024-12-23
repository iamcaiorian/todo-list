require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Api
  class Application < Rails::Application
    config.load_defaults 7.2
    config.autoload_lib(ignore: %w[assets tasks])

    # config.api_only = true should be here, not 'ly.'
    config.api_only = true

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins "http://localhost:5173"
        resource "*", 
          headers: :any, 
          methods: %i[get post put patch delete options head],
          credentials: true
      end
    end
  end
end
