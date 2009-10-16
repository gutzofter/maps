class CreateTowers < ActiveRecord::Migration
  def self.up
    create_table :towers do |t|
      t.column :latitude, :float
      t.column :longitude, :float
      t.column :owner_name, :string, :limit=>200
      t.column :owner_address, :string, :limit=>35
      t.column :owner_city, :string, :limit=>20
      t.column :owner_state, :string, :limit=>2
      t.column :owner_zip, :string, :limit=>10
      t.column :address, :string, :limit=>80
      t.column :city, :string, :limit=>20
      t.column :state, :string, :limit=>2
      t.column :height, :float
      t.column :elevation, :float
      t.column :ohag, :float
      t.column :ohamsl, :float
      t.column :structure_type, :string, :limit=>6
    end
    add_index :towers, :state
    add_index :towers, :latitude
    add_index :towers, :longitude
  end

  def self.down
    drop_table :towers
  end
end
