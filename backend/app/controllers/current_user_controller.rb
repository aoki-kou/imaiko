class CurrentUserController < ApplicationController
  before_action :authenticate_user!

  def show
    render json: { id: current_user.id, email: current_user.email }, status: :ok
  end
end
