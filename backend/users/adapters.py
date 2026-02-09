from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.models import EmailAddress
from django.contrib.auth import get_user_model

User = get_user_model()


class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        """
        Connect existing user account if email already exists.
        """
        # If the social account is already connected, do nothing
        if sociallogin.is_existing:
            return

        # Try to get email from sociallogin
        email = None
        
        # Check email_addresses first
        if sociallogin.email_addresses:
            email = sociallogin.email_addresses[0].email.lower()
        # Fallback to user data
        elif sociallogin.account.extra_data.get('email'):
            email = sociallogin.account.extra_data.get('email').lower()

        if not email:
            return

        # Try to find existing user with this email
        try:
            user = User.objects.get(email__iexact=email)
            # Connect the social account to existing user
            sociallogin.connect(request, user)
        except User.DoesNotExist:
            # User doesn't exist, let allauth create new user
            pass
        except User.MultipleObjectsReturned:
            # Multiple users with same email, skip auto-connect
            pass
