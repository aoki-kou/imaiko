class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private

  # Registration signs the user in (sign_up -> sign_in) so a fresh JWT can be
  # dispatched immediately. Force store: false so this never persists a
  # session cookie — authentication must stay JWT-only.
  def sign_in(resource_or_scope, *args)
    options = args.extract_options!
    super(resource_or_scope, *args, options.merge(store: false))
  end

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: { user: serialize_user(resource) }, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_content
    end
  end

  def serialize_user(user)
    { id: user.id, email: user.email }
  end
end
