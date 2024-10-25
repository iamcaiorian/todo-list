class Todolist < ApplicationRecord
    has_many :tasks, class_name: 'Task', dependent: :destroy
end
