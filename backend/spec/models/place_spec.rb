require "rails_helper"

RSpec.describe Place, type: :model do
  let!(:user) { User.create!(email: "test@example.com", password: "password123", password_confirmation: "password123") }

  def build_place(attrs = {})
    Place.new({ name: "東京タワー", prefecture: "東京都", url: "https://example.com", memo: "夜景がきれい", user: user }.merge(attrs))
  end

  it "is valid with valid attributes" do
    expect(build_place).to be_valid
  end

  it "is invalid without a name" do
    place = build_place(name: nil)
    expect(place).not_to be_valid
    expect(place.errors[:name]).to be_present
  end

  it "is invalid without a prefecture" do
    place = build_place(prefecture: nil)
    expect(place).not_to be_valid
    expect(place.errors[:prefecture]).to be_present
  end

  it "is invalid when prefecture is not one of the 47 defined prefectures" do
    place = build_place(prefecture: "東京県")
    expect(place).not_to be_valid
    expect(place.errors[:prefecture]).to be_present
  end

  it "is valid for every one of the 47 defined prefectures" do
    Place::PREFECTURES.each do |prefecture|
      expect(build_place(prefecture: prefecture)).to be_valid
    end
  end

  it "has exactly 47 prefectures defined" do
    expect(Place::PREFECTURES.size).to eq(47)
  end

  it "is valid without a url" do
    expect(build_place(url: nil)).to be_valid
    expect(build_place(url: "")).to be_valid
  end

  it "is invalid when url is present but not https" do
    place = build_place(url: "http://example.com")
    expect(place).not_to be_valid
    expect(place.errors[:url]).to be_present
  end

  it "is invalid when url is present but not a valid format" do
    place = build_place(url: "not a url")
    expect(place).not_to be_valid
  end

  it "is invalid without a user" do
    place = build_place(user: nil)
    expect(place).not_to be_valid
  end
end
