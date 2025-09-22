from rest_framework.decorators import api_view
from rest_framework.response import Response
from .integration import fetch_mandi_prices, fetch_schemes_list
from .services import schemes_service

@api_view(["GET"])
def mandi_prices_view(request):
    state = request.GET.get("state")
    commodity = request.GET.get("commodity")
    limit = int(request.GET.get("limit", 50))
    try:
        data = fetch_mandi_prices(state=state, commodity=commodity, limit=limit)
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["GET"])
def fetch_and_persist_schemes(request):
    """
    Fetch schemes dataset from data.gov.in and persist to local DB.
    """
    try:
        payload = fetch_schemes_list(limit=int(request.GET.get("limit", 200)))
        records = payload.get("records") or payload.get("data") or []
        persisted = []
        for r in records:
            obj = schemes_service.create_or_update_scheme_from_dict(r)
            persisted.append(obj.title)
        return Response({"persisted_count": len(persisted), "titles": persisted})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
