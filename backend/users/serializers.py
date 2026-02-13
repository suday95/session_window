from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'role', 'avatar', 'first_name', 'last_name']
        read_only_fields = ['id']
    def to_representation(self, instance):
        """Return lowercase role to frontend"""
        data = super().to_representation(instance)
        data['role'] = data['role'].lower() if data['role'] else None
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(required=False)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'role', 'first_name', 'last_name']
    def validate_role(self, value):
        """Accept lowercase and convert to uppercase for storage, strip extra quotes"""
        if value:
            # Strip any extra quotes that might be embedded
            cleaned = value.strip().strip('"').strip("'").lower()
            if cleaned in ['user', 'creator']:
                return cleaned.upper()
            raise serializers.ValidationError(f"'{cleaned}' is not a valid choice. Use 'user' or 'creator'.")
        return 'USER'
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        from django.contrib.auth import authenticate
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        
        refresh = RefreshToken.for_user(user)
        return {
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
