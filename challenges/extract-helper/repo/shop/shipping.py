RATE_PER_KG = 4.5
MIN_FEE = 5.0


def shipping_cost(weight_kg):
    """Cost to ship a parcel: 4.50 per kg, at least 5.00."""
    if type(weight_kg) not in (int, float) or not weight_kg > 0:
        raise ValueError("weight_kg must be a positive number")
    return max(MIN_FEE, round(weight_kg * RATE_PER_KG, 2))
