import os
import requests
from urllib.parse import urlencode

DATA_GOV_API_KEY = os.getenv("DATA_GOV_API_KEY")
AGMARKNET_RESOURCE_ID = os.getenv("AGMARKNET_RESOURCE_ID")
SCHEMES_RESOURCE_ID = os.getenv("SCHEMES_RESOURCE_ID")  # optional, set if found

DATA_GOV_BASE = "https://api.data.gov.in/resource/"

def fetch_mandi_prices(state=None, commodity=None, limit=100):
    """
    Fetch mandi prices (Agmarknet) via data.gov.in resource.
    Resource id default: AGMARKNET_RESOURCE_ID (set in .env)
    """
    resource = AGMARKNET_RESOURCE_ID
    if not resource:
        raise RuntimeError("AGMARKNET_RESOURCE_ID not set in environment")
    url = f"{DATA_GOV_BASE}{resource}"
    params = {"api-key": DATA_GOV_API_KEY, "format": "json", "limit": limit}
    if state:
        params["filters[state]"] = state
    if commodity:
        params["filters[commodity]"] = commodity
    resp = requests.get(url, params=params, timeout=15)
    resp.raise_for_status()
    return resp.json()

def fetch_schemes_list(limit=100):
    """
    Try to fetch schemes dataset from data.gov.in if resource id is set.
    If SCHEMES_RESOURCE_ID not provided, return empty list and recommend manual ingestion.
    """
    resource = SCHEMES_RESOURCE_ID
    if not resource:
        return {"error": "SCHEMES_RESOURCE_ID not configured. Please set resource id for schemes dataset in .env"}
    url = f"{DATA_GOV_BASE}{resource}"
    params = {"api-key": DATA_GOV_API_KEY, "format": "json", "limit": limit}
    resp = requests.get(url, params=params, timeout=15)
    resp.raise_for_status()
    return resp.json()
