from shop.validators import require_positive

RATE_PER_KG = 4.5
MIN_FEE = 5.0


def shipping_cost(weight_kg):
    """Cost to ship a parcel: 4.50 per kg, at least 5.00."""
    require_positive("weight_kg", weight_kg)
    return max(MIN_FEE, round(weight_kg * RATE_PER_KG, 2))
