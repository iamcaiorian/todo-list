class CreateTodolists < ActiveRecord::Migration[7.2]
  def change
    create_table :todolists do |t|
      t.string :title

      t.timestamps
    end
  end
end
