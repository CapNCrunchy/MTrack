from django.urls import path
from .views import UserSignUp, UserLogin, UserLogout, UserView

urlpatterns = [
    path("signup", UserSignUp.as_view(), name="signup"),
    path("login", UserLogin.as_view(), name="login"),
    path("logout", UserLogout.as_view(), name="logout"),
    path("user", UserView.as_view(), name="user"),
]