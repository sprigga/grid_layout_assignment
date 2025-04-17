# urls.py
from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.grid_editor, name='grid_editor'),
    path('save-grid-layout/', views.save_grid_layout, name='save_grid_layout'),
    path('get-grid-layout/', views.get_grid_layout, name='get_grid_layout'),
    # path('grid-list/', views.grid_list, name='grid_list'),
    path('layout-versions/', views.layout_versions, name='layout_versions'),
    path('delete-layout-version/<int:version_id>/', views.delete_layout_version, name='delete_layout_version'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    # path('logout/', auth_views.LogoutView.as_view(next_page='/login/'), name='logout'),
    path('logout/', views.custom_logout, name='logout'),  # 使用自訂登出視圖
    path('register/', views.register, name='register'),
]