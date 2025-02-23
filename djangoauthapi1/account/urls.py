from django.urls import path ,include
from account.views import SendPasswordResetEmailView, UserChangePasswordView, UserLoginView, UserProfileView, UserRegistrationView, UserPasswordResetView,bookingList,ever_infoView,itineraryView,Everest_Included_Ornot_View,Cards_view,Pokhara_infoView,Pokhara_itineraryView,Pokhara_Included_Ornot_View
from account.views import  BookingDetailView,BookingListCreateView,CardDetailView,DestinationViewSet,PreferenceView,UserPreferenceView,DestinationRecommendationView,AdminRegistrationView, AdminLoginView,  AdminProfileView, AdminChangePasswordView, AdminPasswordResetView,handle_payment, check_payment_status,productList
from . import views
from rest_framework.routers import DefaultRouter
from .views import DestinationViewSet
router = DefaultRouter()
router.register(r'destination', DestinationViewSet, basename='destination')
urlpatterns = [
    path('admin-register/', AdminRegistrationView.as_view(), name='register'),
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin-profile/', AdminProfileView.as_view(), name='profile'),
    path('admin-changepassword/', AdminChangePasswordView.as_view(), name='changepassword'),
    path('admin-reset-password/<uid>/<token>/', AdminPasswordResetView.as_view(), name='reset-password'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
    path('bookings/', bookingList.as_view(), name='booking'),
     path('booking/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('booking/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('product_add/', productList.as_view(), name='product'),
    path('everest_info/',ever_infoView.as_view(), name='ever_info'),
    path('itinerary/',itineraryView.as_view(), name='itinerary'),
    path('everest_inc_exc/',Everest_Included_Ornot_View.as_view(), name='everest_inc_exc'),
    path('cards/',Cards_view.as_view(), name='Cards'),
    path('cards/<int:card_id>/', CardDetailView.as_view(), name='card_detail'),
    path('Pokhara_info/',Pokhara_infoView.as_view(), name='Pokhara_info'),
    path('Pokhara_itinerary/',Pokhara_itineraryView.as_view(), name='Pokhara_itinerary'),
    path('Pokhara_inc_exc/',Pokhara_Included_Ornot_View.as_view(), name='Pokhara_inc_exc'),
    path('handle-payment/', handle_payment, name='handle_payment'),
    path('check-payment-status/', check_payment_status, name='check_payment_status'),
    path('recommendations/', DestinationRecommendationView.as_view(), name='recommendations'),
    path('user-preferences/',UserPreferenceView.as_view(),name='user-preferences'),
    path('preferences/',PreferenceView.as_view(),name='preferences'),
    path('destinations/', views.get_destinations, name='get_destinations'),  # To fetch destinations
    path('',  include(router.urls)),
    # path("track-page/", views.track_page, name="track-page"),
    ]
   