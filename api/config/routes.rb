Rails.application.routes.draw do
  resources :tasks
  resources :todolists

  put 'todolists/:id', to: 'todolists#update'
  
  get 'todolists/:todolist_id/tasks', to: 'tasks#todolist_tasks'

  get "up" => "rails/health#show", as: :rails_health_check

  put 'todolists/:todolist_id/tasks/:id', to: 'tasks#update'

  delete 'todolists/:todolist_id/tasks/:id', to: 'tasks#destroy'

  post '/tasks', to: 'tasks#create'
end
