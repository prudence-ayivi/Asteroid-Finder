## Asteroid Finder
- Next.js 
- Tailwind CSS

## Features
- Search Near-Earth Objects by date
- Automatic fallback to closest observation date
- Local indexed dataset (CSV → JSON)
- API powered by Next.js

## How it works
1. CSV is indexed by date
2. API serves date-based queries
3. Frontend fetches and displays NEOs 

## Next features : 
- Cron job to get automatic update db from NASA 
- Check object closest aproch on date (from today to future date only)
- Add warning badge for object category 
- Filter to search object by properties (diameter, magnitude)
- Left panel : last 10 objects discovered, graphs of objects discovery
- Right panel : next 10 closet approach
- Export CSV 




