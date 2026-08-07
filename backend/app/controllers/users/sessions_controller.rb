class Users::SessionsController < Devise::SessionsController
  respond_to :json
  # Devise's own verify_signed_out_user is registered via prepend_before_action
  # and would otherwise run first, seeing no session-stored user (we're
  # stateless JWT) and rejecting the request before the token is checked.
  # `force: true` is required because Devise's authenticate_user! helper is a
  # no-op by default inside any Devise controller (devise_controller? guard).
  prepend_before_action(only: [ :destroy ]) { authenticate_user!(force: true) }

  private

  # #create authenticates via `warden.authenticate!(auth_options)` *before*
  # calling `sign_in`, and that authenticate! call already persists the user
  # to the session by default. store: false has to be forced here too, or
  # the session cookie ends up as a working (unintended) login side-channel.
  def auth_options
    super.merge(store: false)
  end

  # Force store: false so a successful login never persists a session
  # cookie — authentication must stay JWT-only, not a cookie side-channel.
  def sign_in(resource_or_scope, *args)
    options = args.extract_options!
    super(resource_or_scope, *args, options.merge(store: false))
  end

  def respond_with(resource, _opts = {})
    render json: { user: serialize_user(resource) }, status: :ok
  end

  def respond_to_on_destroy(non_navigational_status: :no_content)
    if non_navigational_status == :unauthorized
      render json: { message: "既にログアウトしています" }, status: :unauthorized
    else
      render json: { message: "ログアウトしました" }, status: :ok
    end
  end

  def serialize_user(user)
    { id: user.id, email: user.email }
  end
end
