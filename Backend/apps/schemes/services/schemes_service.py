from .models import Scheme

def create_or_update_scheme_from_dict(d):
    title = d.get("title") or d.get("name") or d.get("scheme_name") or "Untitled Scheme"
    obj, _ = Scheme.objects.update_or_create(
        title=title,
        defaults={
            "description": d.get("description") or d.get("short_description"),
            "eligibility": d.get("eligibility", ""),
            "source_url": d.get("url") or d.get("link"),
            "meta": d
        },
    )
    return obj
