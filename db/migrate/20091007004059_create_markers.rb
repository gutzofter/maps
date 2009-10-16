class CreateMarkers < ActiveRecord::Migration
  def self.up
    create_table :markers do |t|
      t.column :lat, :decimal
      t.column :lng, :decimal
      t.column :found, :string, :limit=>100
      t.column :left, :string, :limit=>100
    end
    execute("ALTER TABLE markers MODIFY lat numeric(15,10);")
    execute("ALTER TABLE markers MODIFY lng numeric(15,10);")
  end
  def self.down
    drop_table :markers
  end
end