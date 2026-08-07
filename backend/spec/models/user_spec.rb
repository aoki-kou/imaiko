require "rails_helper"

RSpec.describe User, type: :model do
  def build_user(attrs = {})
    User.new({ email: "test@example.com", password: "password123", password_confirmation: "password123" }.merge(attrs))
  end

  it "is valid with a valid email and password" do
    expect(build_user).to be_valid
  end

  it "is invalid without an email" do
    user = build_user(email: nil)
    expect(user).not_to be_valid
    expect(user.errors[:email]).to be_present
  end

  it "is invalid with a duplicate email" do
    build_user.save!
    duplicate = build_user(email: "TEST@example.com")
    expect(duplicate).not_to be_valid
    expect(duplicate.errors[:email]).to include("has already been taken")
  end

  it "is invalid without a password" do
    user = build_user(password: nil, password_confirmation: nil)
    expect(user).not_to be_valid
  end

  it "is invalid when password confirmation does not match" do
    user = build_user(password_confirmation: "different")
    expect(user).not_to be_valid
  end

  it "sets a jti before create" do
    user = build_user
    expect(user.jti).to be_nil
    user.save!
    expect(user.jti).to be_present
  end
end
