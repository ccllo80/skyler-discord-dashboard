<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Server functions callable from the UI live in `src/lib/api/*.functions.ts` (`**/server/**` is client-import-protected) and lazy-import `src/server/*` inside handlers.
- Discord OAuth lives only in server routes under `src/routes/api/public/auth/*` and `src/server/discord/*`; the browser never sees codes, tokens or the client secret.
- Sessions and the invite-success proof are AES-GCM sealed HttpOnly cookies keyed by `SESSION_SECRET` with purpose-bound AAD (no database); login and invite each use their own OAuth `state` cookie scoped to the OAuth routes.
- Env config is read only through `getDiscordConfig()` in `src/server/discord/config.ts`; missing config redirects to `/setup` instead of faking success.
- Guild management permission is checked server-side (`canManageGuild`) on every dashboard load.
- Dashboard systems are declared in `src/lib/systems.ts`; all stay "soon" until real bot API integration exists.
- All user-facing copy is formal Arabic with RTL (`<html lang="ar" dir="rtl">`).
- Shared mobile navigation is controlled by SiteHeader; guild navigation uses a wrapping grid below desktop, with minmax(0,1fr) content tracks to contain long RTL names without hiding overflow.
