from django.urls import path
from .views import get_csrf_token, UserSignUp, UserLogin, UserLogout, UserView, MedicationViewSet, RecordViewSet

urlpatterns = [
    path("signup", UserSignUp.as_view(), name="signup"),
    path("login", UserLogin.as_view(), name="login"),
    path("logout", UserLogout.as_view(), name="logout"),
    path("user", UserView.as_view(), name="user"),
    path("medications", MedicationViewSet.as_view(
        {'get': 'list', 'post': 'create'}), name="medications"),
    path("medications/today", MedicationViewSet.as_view(
        {'get': 'today'}), name="medications_today"),
    path("api/csrf/", get_csrf_token, name="csrf-token"),
    path("record", RecordViewSet.as_view(
        {'get': 'list', 'post': 'create'}), name="records"),
]
