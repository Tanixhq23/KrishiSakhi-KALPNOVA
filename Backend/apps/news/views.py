from rest_framework.decorators import api_view
from rest_framework.response import Response
from .fetcher import fetch_daily_news

@api_view(["GET"])
def news_list(request):
    limit = int(request.GET.get("limit", 10))
    try:
        data = fetch_daily_news(limit)
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
