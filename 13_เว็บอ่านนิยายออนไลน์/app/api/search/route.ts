import { chapters } from '../../lib/data';
export function GET() { return Response.json(chapters, { headers:{ 'Cache-Control':'public, max-age=3600' } }); }
