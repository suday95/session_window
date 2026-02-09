from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import RegisterView, LoginView, ProfileView, GoogleLogin, GitHubLogin, get_tokens
from session_catalog.views import SessionViewSet
from bookings.views import BookingViewSet

router = DefaultRouter()
router.register('sessions', SessionViewSet, basename='session')
router.register('bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/register/', RegisterView.as_view()),
    path('api/auth/login/', LoginView.as_view()),
    path('api/auth/profile/', ProfileView.as_view()),
    path('api/auth/get-tokens/', get_tokens, name='get_tokens'),
    path('api/auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('api/auth/github/', GitHubLogin.as_view(), name='github_login'),
    path('api/', include(router.urls)),
    path('accounts/', include('allauth.urls')),  # OAuth URLs
]