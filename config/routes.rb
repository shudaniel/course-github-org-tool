Rails.application.routes.draw do
  get 'course' => 'course#show'
  get 'course/setup'
  get 'course/show_roster'
  get 'course/edit_roster'
  get 'course/change_roster'

  resources :users
  root to: 'visitors#index'
  get '/auth/:provider/callback' => 'sessions#create'
  get '/signin' => 'sessions#new', :as => :signin
  get '/signout' => 'sessions#destroy', :as => :signout
  get '/auth/failure' => 'sessions#failure'
end
