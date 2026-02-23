"""
URL configuration for unihacks26 project.


The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rnr import views


urlpatterns = [
    path('admin/', admin.site.urls),
    # User Authentication
    # 🔑 AUTHENTICATION
    # =====================================================
    # 🔑 AUTHENTICATION
    # =====================================================
    path('api/user/signup/', views.user_signup_api, name='user_signup'),
    path('api/user/login/', views.user_login_api, name='user_login'),
   
    path('api/institution/signup/', views.institution_signup_api, name='inst_signup'),
    path('api/institution/login/', views.institution_login_api, name='inst_login'),


    # =====================================================
    # 🔍 DISCOVERY & DASHBOARD
    # =====================================================
    path('api/institutions/', views.search_institutions, name='search_institutions'),
    path('api/user/dashboard/<int:user_id>/', views.get_user_dashboard, name='user_dashboard'),
    path('api/institution/dashboard/<int:inst_id>/', views.get_institution_dashboard, name='inst_dashboard'),


    # =====================================================
    # 🎫 QUEUE & TOKEN OPERATIONS
    # =====================================================
    # NEW: Create a queue
    path('api/queue/create/', views.create_queue_api, name='create_queue'),
    # Join a queue
    path('api/book-token/', views.book_token_api, name='book_token'),
   
    # Institution calls next token
    path('api/queue/call-next/<int:queue_id>/', views.call_next_token, name='call_next'),
   
    # User confirms arrival or gets moved to back
    path('api/token/confirm/<int:token_id>/', views.confirm_token_api, name='confirm_token'),
    path('api/token/snooze/<int:token_id>/', views.snooze_api, name='snooze_token'),


    # =====================================================
    # 🚀 SMART POSITION MANAGEMENT
    # =====================================================
    # The consolidated function for CANCEL, MOVE_FORWARD, MOVE_BACK
    path('api/token/manage/', views.manage_token_position_api, name='token_manage'),
   
    # Accept a pending swap request
    path('api/swap/accept/<int:swap_id>/', views.accept_swap_api, name='accept_swap'),
    
    # Reject a pending swap request
    path('api/swap/reject/<int:swap_id>/', views.reject_swap_api, name='reject_swap'),

    path('api/discovery/', views.discovery_map_api, name='discovery_map'),

]


