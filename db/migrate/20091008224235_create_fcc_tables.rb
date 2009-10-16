class CreateFccTables < ActiveRecord::Migration
  def self.up
    create_table :fcc_locations do |t|
      t.column :unique_si, :integer
      t.column :lat_deg, :integer
      t.column :lat_min, :integer
      t.column :lat_sec, :float
      t.column :lat_dir, :string, :limit=>1
      t.column :latitude, :float
      t.column :long_deg, :integer
      t.column :long_min, :integer
      t.column :long_sec, :float
      t.column :long_dir, :string, :limit=>1
      t.column :longitude, :float
    end
    add_index :fcc_locations, :unique_si
    create_table :fcc_owners do |t|
      t.column :unique_si, :integer
      t.column :name, :string, :limit=>200
      t.column :address, :string, :limit=>35
      t.column :city, :string, :limit=>20
      t.column :state, :string, :limit=>2
      t.column :zip, :string, :limit=>10
    end
    add_index :fcc_owners, :unique_si
    create_table :fcc_structures do |t|
      t.column :unique_si, :integer
      t.column :address, :string, :limit=>80
      t.column :city, :string, :limit=>20
      t.column :state, :string, :limit=>2
      t.column :height, :float
      t.column :elevation, :float
      t.column :ohag, :float
      t.column :ohamsl, :float
      t.column :structure_type, :string, :limit=>6
    end
    add_index :fcc_structures, :unique_si
  end
  def self.down
    drop_table :fcc_locations
    drop_table :fcc_owners
    drop_table :fcc_structures
  end
end