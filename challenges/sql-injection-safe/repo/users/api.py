def handle_search(store, params):
    """GET /users?q=<text> -> {"count": n, "results": [...]}"""
    results = store.search_users(params.get("q", ""))
    return {"count": len(results), "results": results}
