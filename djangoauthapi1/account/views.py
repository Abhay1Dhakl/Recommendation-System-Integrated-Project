from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import status,viewsets
from rest_framework.views import APIView
from account.serializers import DestinationSerializer,PreferencesSerializer,RecommendationSerializer,UserChangePasswordSerializer,AdminPasswordResetSerializer,AdminChangePasswordSerializer,AdminRegistrationSerializer,AdminProfileSerializer,AdminLoginSerializer,SendPasswordResetEmailSerializer, UserChangePasswordSerializer, UserLoginSerializer, UserPasswordResetSerializer, UserProfileSerializer, UserRegistrationSerializer,bookingSerializer,everest_infoSerializer,ItinerarySerializer,Everest_Included_OrnotSerializer, Cards_Serializers,Pokhara_infoSerializer,Pokhara_ItinerarySerializer,Pokhara_Included_OrnotSerializer,productSerializer,UserPreferencesSerializer
from django.contrib.auth import authenticate
from account.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from .models import BookingTable,Destinations,EverestInformation, Itinerary ,Everest_Included_Ornot,Cards, Pokhara_Included_Ornot, PokharaItinerary,PokharaInformation,Destination,UserPreference
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from rest_framework.exceptions import PermissionDenied

from django.shortcuts import render
from .models import UserPreference
from .recommendation import recommend_destinations
import requests

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel


class UserProfileView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def get(self, request, format=None):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


        
# Token Generation
def get_tokens_for_admin(admin):
    refresh = RefreshToken.for_user(admin)
    return {'refresh': str(refresh), 'access': str(refresh.access_token)}

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {'refresh': str(refresh), 'access': str(refresh.access_token)}


#Admin
class AdminRegistrationView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = AdminRegistrationSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      admin = serializer.save()
      token = get_tokens_for_admin(admin)
      return Response({'token':token, 'msg':'Registration Successful'}, status=status.HTTP_201_CREATED)

class AdminLoginView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = AdminLoginSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      email = serializer.data.get('email')
      password = serializer.data.get('password')
      admin = authenticate(email=email, password=password)
      if admin is not None:
         token = get_tokens_for_admin(admin)
         return Response({'token':token, 'msg':'Login Success'}, status=status.HTTP_200_OK)
      else:
        return Response({'errors':{'non_field_errors':['Email or Password is not Valid']}}, status=status.HTTP_404_NOT_FOUND)

class AdminProfileView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def get(self, request, format=None):
    serializer = AdminProfileSerializer(request.admin)
    return Response(serializer.data, status=status.HTTP_200_OK)

class AdminChangePasswordView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def post(self, request, format=None):
    serializer = AdminChangePasswordSerializer(data=request.data, context={'user':request.user})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)

class SendPasswordResetEmailView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = SendPasswordResetEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)

class AdminPasswordResetView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, uid, token, format=None):
    serializer = AdminPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)


#User 

class UserRegistrationView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    token = get_tokens_for_user(user)
    return Response({'token':token, 'msg':'Registration Successful'}, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.data.get('email')
    password = serializer.data.get('password')
    user = authenticate(email=email, password=password)
    if user is not None:
      token = get_tokens_for_user(user)
      return Response({'token':token, 'msg':'Login Success'}, status=status.HTTP_200_OK)
    else:
      return Response({'errors':{'non_field_errors':['Email or Password is not Valid']}}, status=status.HTTP_404_NOT_FOUND)

class UserProfileView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def get(self, request, format=None):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

class UserChangePasswordView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def post(self, request, format=None):
    serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)

class SendPasswordResetEmailView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = SendPasswordResetEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, uid, token, format=None):
    serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)

class bookingList(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = bookingSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    token = get_tokens_for_user(user)
    return Response({'token':token, 'msg':'Booked Successfully'}, status=status.HTTP_201_CREATED)


# List and Create View
class BookingListCreateView(ListCreateAPIView):
    queryset = BookingTable.objects.all()
    serializer_class = bookingSerializer
    permission_classes = [IsAuthenticated]

# # Retrieve, Update, and Delete View
# class BookingDetailView(RetrieveUpdateDestroyAPIView):
#     queryset = BookingTable.objects.all()
#     serializer_class = bookingSerializer
#     permission_classes = [IsAuthenticated]
    
class BookingDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = bookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return bookings for the logged-in user only
        return BookingTable.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        # Ensure the user is the owner of the booking
        booking = self.get_object()
        if booking.user != self.request.user:
            raise PermissionDenied("You do not have permission to edit this booking.")
        serializer.save()

    def perform_destroy(self, instance):
        # Ensure the user is the owner of the booking
        if instance.user != self.request.user:
            raise ("You do not have permission to delete this booking.")
        instance.delete()
    
    
class productList(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = productSerializer(data = request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    token = get_tokens_for_admin(user)
    return Response({'msg': 'Product Added Successfully'}, status= status.HTTP_201_CREATED)


class ever_infoView(ListAPIView):
  queryset = EverestInformation.objects.all()
  serializer_class = everest_infoSerializer
 
class itineraryView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = ItinerarySerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()  # Save the itinerary
            queryset = Itinerary.objects.all()
            serializer_class = ItinerarySerializer
            return ItinerarySerializer
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        serializer = ItinerarySerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()  # Save the itinerary
            queryset = Itinerary.objects.all()
            serializer_class = ItinerarySerializer
            return ItinerarySerializer
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_destinations(request):
    destinations = Destinations.objects.all()
    serializer = DestinationSerializer(destinations, many=True)
    return Response(serializer.data)

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destinations.objects.all()
    serializer_class = DestinationSerializer
    def get_queryset(self):
        # Optionally, you can filter the data here if needed
        return self.queryset

    @action(detail=True, methods=['put'], url_path='update-destination')
    def update_destination(self, request, pk=None):
        destination = self.get_object()
        serializer = self.get_serializer(destination, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'], url_path='delete-destination')
    def delete_destination(self, request, pk=None):
        destination = self.get_object()
        destination.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class Everest_Included_Ornot_View(ListAPIView):
  queryset = Everest_Included_Ornot.objects.all()
  serializer_class = Everest_Included_OrnotSerializer

class Cards_view(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve all cards."""
        cards = Cards.objects.all()
        serializer = Cards_Serializers(cards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new card."""
        serializer = Cards_Serializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      
class CardDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, card_id):
        try:
            return Cards.objects.get(id=card_id)
        except Cards.DoesNotExist:
            return None

    def put(self, request, card_id):
        """Update an existing card."""
        card = self.get_object(card_id)
        if not card:
            return Response({"error": "Card not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = Cards_Serializers(card, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, card_id):
        """Delete a card."""
        card = self.get_object(card_id)
        if not card:
            return Response({"error": "Card not found"}, status=status.HTTP_404_NOT_FOUND)

        card.delete()
        return Response({"message": "Card deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
class Pokhara_infoView(ListAPIView):
  queryset = PokharaInformation.objects.all()
  serializer_class = everest_infoSerializer
 
class Pokhara_itineraryView(ListAPIView):
  queryset = PokharaItinerary.objects.all()
  serializer_class = Pokhara_ItinerarySerializer

class Pokhara_Included_Ornot_View(ListAPIView):
  queryset = Pokhara_Included_Ornot.objects.all()
  serializer_class = Everest_Included_OrnotSerializer

class UserPreferenceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        # Fetch the current user preferences
        try:
            user_preference = UserPreference.objects.get(user=request.user)
            serializer = UserPreferencesSerializer(user_preference)
            return Response(serializer.data)
        except UserPreference.DoesNotExist:
            return Response({"message": "No user preference found."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        # If the user already has a preference, delete it
        try:
            user_preference = UserPreference.objects.get(user=request.user)
            user_preference.delete()
        except UserPreference.DoesNotExist:
            pass  # If no previous preferences, do nothing
        
        # Now create a new user preference
        serializer = UserPreferencesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Save with the logged-in user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PreferenceView(APIView):
    renderer_classes = [UserRenderer]
    
    def post(self, request, format=None):
      serializer = PreferencesSerializer(data=request.data)
      if serializer.is_valid():
          # Use create_or_update logic
          preference = serializer.create_or_update(serializer.validated_data)
          return Response(PreferencesSerializer(preference).data, status=status.HTTP_200_OK)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Recommendation View
def get_destination_data():
    destinations = Destination.objects.all()
    data = {
        'name': [],
        'country': [],
        'destination_type': [],
        'activities': [],
        'budget_range': [],
        'family_friendly': [],
        'eco_friendly': [],
        'rating': [],
    }
    for dest in destinations:
        data['name'].append(dest.name)
        data['country'].append(dest.country)
        data['destination_type'].append(dest.destination_type)
        data['activities'].append(dest.activities)
        data['budget_range'].append(dest.budget_range)
        data['family_friendly'].append(dest.family_friendly)
        data['eco_friendly'].append(dest.eco_friendly)
        data['rating'].append(dest.rating)
    
    return pd.DataFrame(data)

def recommend_destinations(user_preferences):
    print("User Preferences:", user_preferences)
    # Get destination data
    destination_df = get_destination_data()
    print("destination data", destination_df)
   
    tfidf = TfidfVectorizer(stop_words='english')
    destination_df['activities'] = destination_df['activities'].fillna('')
    tfidf_matrix = tfidf.fit_transform(destination_df['activities'])
   
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    
    preferred_activities = user_preferences['preferred_activities']
    preferred_dest_types = user_preferences['preferred_destination_types']

    
    mask = (
        destination_df['destination_type'].isin(preferred_dest_types) |
        destination_df['activities'].str.contains('|'.join(preferred_activities))
    )
    print("Mask:\n", mask)

    recommended_indices = [i for i in range(len(destination_df)) if mask[i]]


    # Sort by the rating
    recommended_destinations = destination_df.iloc[recommended_indices].sort_values(by='rating', ascending=False)
    print("recommended data:",recommended_destinations)
    return recommended_destinations[['name', 'country', 'activities', 'budget_range', 'rating']]

class DestinationRecommendationView(APIView):
    def post(self, request, *args, **kwargs):
        print("Incoming data:", request.data)
        serializer = RecommendationSerializer(data=request.data)
        if serializer.is_valid():
            user_preferences = serializer.validated_data
            print("user",user_preferences)
            recommendations = recommend_destinations(user_preferences)
            print("data are",recommendations)
            return Response(recommendations.to_dict(orient='records'), status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def track_page(request):
    if request.method == "POST":
        data = json.loads(request.body)
        page = data.get("page")
        print(f"User visited: {page}")  # Log or process the data
        return JsonResponse({"message": "Page tracked successfully!"})
    return JsonResponse({"error": "Invalid request"}, status=400)

# def initiate_payment(request):
#     # Example payload for initiating payment
#     payload = {
#         'amount': 1000,  # Example amount
#         'order_id': 'ORDER123'  # Example order ID
#     }

#     # Replace 'YOUR_INITIATION_ENDPOINT' with the actual initiation endpoint provided by eSewa
#     initiation_endpoint = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'

#     try:
#         response = requests.post(initiation_endpoint, json=payload)
#         if response.status_code == 200:
#             return JsonResponse(response.json())
#         else:
#             return JsonResponse({"error": "Failed to initiate payment"}, status=500)
#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)

# def verify_payment(request):
#     # Example payload for verifying payment
#     payload = {
#         'payment_id': request.POST.get('payment_id'),  # Example: Get payment ID from request
#         'amount': request.POST.get('amount')  # Example: Get amount from request
#     }

#     # Replace 'YOUR_VERIFICATION_ENDPOINT' with the actual verification endpoint provided by eSewa
#     verification_endpoint = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'

#     try:
#         response = requests.post(verification_endpoint, json=payload)
#         if response.status_code == 200:
#             return JsonResponse(response.json())
#         else:
#             return JsonResponse({"error": "Failed to verify payment"}, status=500)
#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)

def handle_payment(request):
    # Handle payment form submission here
    if request.method == 'POST':
        # Retrieve form data from request.POST
        amount = request.POST.get('amount')
        tax_amount = request.POST.get('tax_amount')
        total_amount = request.POST.get('total_amount')
        transaction_uuid = request.POST.get('transaction_uuid')
        # Process payment and generate response
        
        # For now, let's return a simple success response
        return JsonResponse({"status": "SUCCESS", "message": "Payment received", "amount": amount})
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)

def check_payment_status(request):
    # Handle status check API here
    if request.method == 'GET':
        # Retrieve product code, total amount, and transaction UUID from request.GET
        product_code = request.GET.get('product_code')
        total_amount = request.GET.get('total_amount')
        transaction_uuid = request.GET.get('transaction_uuid')
        
        # Check payment status and generate response
        
        # For now, let's return a simple success response
        return JsonResponse({"status": "SUCCESS", "message": "Payment successful", "transaction_code": "0004T5I"})
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
