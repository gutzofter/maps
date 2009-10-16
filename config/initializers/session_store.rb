# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_maps_session',
  :secret      => 'adf95f8bbc4b374c2cb834164157fbc9854add0238cfe4dc78fa536d352d4a6ad37de8a2f99d097f18fa1e164ac2c93c69d0b65d1d3246f6e291cd51ee6be47a'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
