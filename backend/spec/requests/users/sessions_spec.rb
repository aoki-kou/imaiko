require "rails_helper"

RSpec.describe "Users::Sessions", type: :request do
  let!(:user) { User.create!(email: "test@example.com", password: "password123", password_confirmation: "password123") }

  describe "POST /users/sign_in" do
    it "logs in with valid credentials and returns a JWT" do
      post "/users/sign_in", params: { user: { email: user.email, password: "password123" } }
      expect(response).to have_http_status(:ok)
      expect(response.headers["Authorization"]).to be_present
    end

    it "rejects invalid credentials" do
      post "/users/sign_in", params: { user: { email: user.email, password: "wrongpassword" } }
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "DELETE /users/sign_out" do
    it "logs out and revokes the token so it can no longer be used" do
      post "/users/sign_in", params: { user: { email: user.email, password: "password123" } }
      token = response.headers["Authorization"]

      delete "/users/sign_out", headers: { "Authorization" => token }
      expect(response).to have_http_status(:ok)

      get "/current_user", headers: { "Authorization" => token }
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
