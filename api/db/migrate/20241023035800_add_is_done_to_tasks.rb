class AddIsDoneToTasks < ActiveRecord::Migration[7.2]
  def change
    add_column :tasks, :is_done, :boolean, default: false
  end
end
