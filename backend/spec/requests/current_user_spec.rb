require "rails_helper"

RSpec.describe "CurrentUser", type: :request do
  let!(:user) { User.create!(email: "test@example.com", password: "password123", password_confirmation: "password123") }

  it "returns the current user when authenticated" do
    post "/users/sign_in", params: { user: { email: user.email, password: "password123" } }
    token = response.headers["Authorization"]

    get "/current_user", headers: { "Authorization" => token }
    expect(response).to have_http_status(:ok)

    json = JSON.parse(response.body)
    expect(json["email"]).to eq(user.email)
  end

  it "returns unauthorized without a token" do
    get "/current_user"
    expect(response).to have_http_status(:unauthorized)
  end
end
