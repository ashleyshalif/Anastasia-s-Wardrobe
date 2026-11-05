subcats = {
    'knitwear': ['knit', 'cardigan', 'jumper', 'sweater'],
    'dresses': ['dress', 'sundress', 'slip'],
    'tops': ['shirt', 'blouse', 'top', 'tee', 'co-ord'],
    'trousers-and-skirts': ['trousers', 'jeans', 'skirt', 'pants', 'culotte'],
    'outerwear': ['blazer', 'coat', 'jacket'],
}

products = [
    {'name': 'Ines Oxford Cotton Shirt', 'dept': 'Women', 'desc': 'Relaxed boyfriend-fit shirt in crisp Italian organic cotton.'},
    {'name': 'Lucie Wide-Leg Trousers', 'dept': 'Women', 'desc': 'High-waisted fluid trousers cut from structured wool blend.'},
    {'name': 'Margot Straight-Leg Jeans', 'dept': 'Women', 'desc': 'Classic high-rise straight-leg jeans in premium rigid Japanese denim.'},
    {'name': 'Elodie Corduroy Co-ord', 'dept': 'Women', 'desc': 'Fine-wale corduroy cropped overshirt and wide culotte two-piece.'},
    {'name': 'Camille Tailored Wool Blazer', 'dept': 'Women', 'desc': 'Single-breasted structured blazer in virgin Italian wool.'},
    {'name': 'Cashmere Crewneck Jumper', 'dept': 'Women', 'desc': 'Seamless crewneck knit in Grade-A Mongolian cashmere.'},
    {'name': 'Amelie Wrap Midi Dress', 'dept': 'Women', 'desc': 'Graceful wrap midi dress cut from liquid silk-viscose blend.'},
    {'name': 'Sunday Wool Cardigan', 'dept': 'Women', 'desc': 'Chunky shaker-stitch cardigan with horn buttons in pure lambswool.'},
]

for sub, kws in subcats.items():
    matched = [p['name'] for p in products if any(kw in f"{p['name']} {p['dept']} {p['desc']}".lower() for kw in kws)]
    print(f'{sub}: {len(matched)} matched -> {matched}')

