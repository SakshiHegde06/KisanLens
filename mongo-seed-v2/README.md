# KisanLens - MongoDB seed data (v2 - expanded)

21 crops, 40 treatment entries. Replaces the earlier 7-crop/18-treatment version.

## What's here

- `crops_seed.json` - Arecanut, Cashew, Tomato, Cabbage, Chilli, Marigold, Rose, Banana, Brinjal, Papaya, Coffee, Radish, Coconut, Potato, Onion, Okra, French Beans, Cucumber, Carrot, Black Pepper, Ginger
- `treatment_kb_seed.json` - 40 disease entries covering every disease referenced above, cross-checked for completeness

Same caveat as before: standard agronomic reference ranges for a capstone demo, not verified local advice.

## If you already imported the earlier v1 seed data

Drop the existing collections first so you don't end up with duplicates:

In Compass: open `crops` collection -> Delete All documents (or drop the whole collection and let it get recreated on next import). Repeat for `treatment_kb`.

Then import fresh:
```powershell
mongoimport --db kisanlens --collection crops --file crops_seed.json --jsonArray
mongoimport --db kisanlens --collection treatment_kb --file treatment_kb_seed.json --jsonArray
```

Or via Compass's Import Data button on each collection, same as before.

## Verify

`crops` should have 21 documents, `treatment_kb` should have 40.
