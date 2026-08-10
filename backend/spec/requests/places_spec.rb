require "rails_helper"

RSpec.describe "Places", type: :request do
  let!(:user) { User.create!(email: "test@example.com", password: "password123", password_confirmation: "password123") }
  let!(:other_user) { User.create!(email: "other@example.com", password: "password123", password_confirmation: "password123") }

  def auth_headers_for(user)
    post "/users/sign_in", params: { user: { email: user.email, password: "password123" } }
    { "Authorization" => response.headers["Authorization"] }
  end

  let(:headers) { auth_headers_for(user) }

  describe "GET /places" do
    let!(:tokyo_place) { Place.create!(name: "東京タワー", prefecture: "東京都", user: user) }
    let!(:osaka_place) { Place.create!(name: "通天閣", prefecture: "大阪府", user: user) }
    let!(:other_users_place) { Place.create!(name: "他人の場所", prefecture: "東京都", user: other_user) }

    it "returns only the current user's places" do
      get "/places", headers: headers
      expect(response).to have_http_status(:ok)
      ids = JSON.parse(response.body).map { |place| place["id"] }
      expect(ids).to contain_exactly(tokyo_place.id, osaka_place.id)
    end

    it "filters by prefecture" do
      get "/places", params: { prefecture: "東京都" }, headers: headers
      expect(response).to have_http_status(:ok)
      ids = JSON.parse(response.body).map { |place| place["id"] }
      expect(ids).to contain_exactly(tokyo_place.id)
    end

    it "requires authentication" do
      get "/places"
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "POST /places" do
    it "creates a place for the current user" do
      post "/places", params: { place: { name: "東京タワー", prefecture: "東京都", url: "https://example.com", memo: "夜景" } }, headers: headers
      expect(response).to have_http_status(:created)
      expect(user.places.count).to eq(1)
      expect(user.places.first.name).to eq("東京タワー")
    end

    it "rejects an invalid prefecture" do
      post "/places", params: { place: { name: "東京タワー", prefecture: "東京県" } }, headers: headers
      expect(response).to have_http_status(:unprocessable_content)
    end

    it "rejects a non-https url" do
      post "/places", params: { place: { name: "東京タワー", prefecture: "東京都", url: "http://example.com" } }, headers: headers
      expect(response).to have_http_status(:unprocessable_content)
    end

    it "requires authentication" do
      post "/places", params: { place: { name: "東京タワー", prefecture: "東京都" } }
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "PATCH /places/:id" do
    let!(:place) { Place.create!(name: "東京タワー", prefecture: "東京都", user: user) }
    let!(:other_users_place) { Place.create!(name: "他人の場所", prefecture: "東京都", user: other_user) }

    it "updates the current user's place" do
      patch "/places/#{place.id}", params: { place: { memo: "更新後のメモ" } }, headers: headers
      expect(response).to have_http_status(:ok)
      expect(place.reload.memo).to eq("更新後のメモ")
    end

    it "returns 404 for another user's place" do
      patch "/places/#{other_users_place.id}", params: { place: { memo: "更新後のメモ" } }, headers: headers
      expect(response).to have_http_status(:not_found)
    end

    it "requires authentication" do
      patch "/places/#{place.id}", params: { place: { memo: "更新後のメモ" } }
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "DELETE /places/:id" do
    let!(:place) { Place.create!(name: "東京タワー", prefecture: "東京都", user: user) }
    let!(:other_users_place) { Place.create!(name: "他人の場所", prefecture: "東京都", user: other_user) }

    it "deletes the current user's place" do
      delete "/places/#{place.id}", headers: headers
      expect(response).to have_http_status(:no_content)
      expect(Place.exists?(place.id)).to be false
    end

    it "returns 404 for another user's place" do
      delete "/places/#{other_users_place.id}", headers: headers
      expect(response).to have_http_status(:not_found)
      expect(Place.exists?(other_users_place.id)).to be true
    end

    it "requires authentication" do
      delete "/places/#{place.id}"
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
