class CreatePlaces < ActiveRecord::Migration[8.1]
  def change
    create_table :places do |t|
      t.string :name, null: false
      t.string :prefecture, null: false
      t.string :url
      t.text :memo
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    add_index :places, [:user_id, :prefecture]
  end
end
