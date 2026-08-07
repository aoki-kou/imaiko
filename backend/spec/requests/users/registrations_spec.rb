require "rails_helper"

RSpec.describe "Users::Registrations", type: :request do
  describe "POST /users" do
    let(:valid_params) do
      { user: { email: "test@example.com", password: "password123", password_confirmation: "password123" } }
    end

    it "creates a new user and returns a JWT in the Authorization header" do
      post "/users", params: valid_params
      expect(response).to have_http_status(:created)
      expect(response.headers["Authorization"]).to be_present

      json = JSON.parse(response.body)
      expect(json["user"]["email"]).to eq("test@example.com")
    end

    it "returns errors for invalid params" do
      post "/users", params: { user: { email: "", password: "short", password_confirmation: "short" } }
      expect(response).to have_http_status(:unprocessable_content)

      json = JSON.parse(response.body)
      expect(json["errors"]).to be_present
    end
  end
end
