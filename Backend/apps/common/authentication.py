from rest_framework.authentication import BaseAuthentication

class TokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        return None
