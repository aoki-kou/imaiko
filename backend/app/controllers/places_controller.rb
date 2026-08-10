class PlacesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_place, only: %i[update destroy]

  def index
    places = current_user.places
    places = places.where(prefecture: params[:prefecture]) if params[:prefecture].present?

    render json: places.map { |place| serialize_place(place) }, status: :ok
  end

  def create
    place = current_user.places.build(place_params)

    if place.save
      render json: serialize_place(place), status: :created
    else
      render json: { errors: place.errors.full_messages }, status: :unprocessable_content
    end
  end

  def update
    if @place.update(place_params)
      render json: serialize_place(@place), status: :ok
    else
      render json: { errors: @place.errors.full_messages }, status: :unprocessable_content
    end
  end

  def destroy
    @place.destroy!
    head :no_content
  end

  private

  def set_place
    @place = current_user.places.find(params[:id])
  end

  def place_params
    params.require(:place).permit(:name, :prefecture, :url, :memo)
  end

  def serialize_place(place)
    {
      id: place.id,
      name: place.name,
      prefecture: place.prefecture,
      url: place.url,
      memo: place.memo,
      created_at: place.created_at,
      updated_at: place.updated_at
    }
  end
end
