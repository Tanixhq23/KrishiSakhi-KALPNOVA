from rest_framework.authentication import BaseAuthentication

class DummyAuth(BaseAuthentication):
    def authenticate(self, request):
        return None
