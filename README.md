# SKYLER Discord Dashboard

Build the initial SKYLER Discord bot website as a polished, responsive Arabic-first web application. This is the real project foundation, not a static mockup.

PRODUCT AND LANGUAGE
- Product name: SKYLER.
- All user-facing text must be Modern Standard Arabic only, with correct RTL layout, including navigation, buttons, validation, empty states, errors, loading states, dialogs, and helper text. Do not use colloquial Arabic.
- Use a refined, premium, modern dark visual identity: near-black/charcoal background, restrained silver/white typography, subtle gradients and soft accent lighting. Avoid excessive glassmorphism, visual clutter, and childish styling.
- Smooth responsive interactions and meaningful pressed/hover/focus states. Buttons should visibly depress on click and have accessible keyboard focus states.
- Mobile-first and desktop polished.

INITIAL SCOPE
1) Public landing page at /:
   - Brand/navigation header with SKYLER logo/wordmark.
   - Hero section with concise Arabic description of SKYLER as a Discord server management bot.
   - Two prominent wide primary actions centered in the page: "إضافة البوت" and "تسجيل الدخول".
   - Add compact feature/benefit sections and a section introducing the eight dashboard systems: الترحيب، المستويات، الرد التلقائي، الإشراف، الإمبيدات، الرتب التفاعلية، الأوامر، السجلات.
   - Footer with useful navigation placeholders.
2) Add bot flow:
   - "إضافة البوت" must start a Discord OAuth2 authorization flow intended for bot + applications.commands scopes and configured permissions. Do not fake OAuth success or show a fake server picker.
   - Prepare a clean integration boundary for the backend OAuth start/callback. If credentials/callback configuration are absent, show a clear Arabic setup-required state rather than a non-working fake action.
   - After a real successful authorization callback, the future flow should show success confirmation with a distinct "متابعة" button returning to the landing page.
3) Login flow:
   - "تسجيل الدخول" must start Discord OAuth2 using identify and guilds scopes.
   - Prepare backend-only OAuth integration boundaries; never expose client secret or exchange authorization codes in the browser.
   - Do not fabricate a signed-in user or server list. Until OAuth credentials and callback URL are configured, show a clear Arabic setup-required state.
   - After real login, the intended server picker must show all servers the user can manage, whether or not SKYLER is installed. Clearly label bot status as "البوت متصل" or "البوت غير موجود". Do not implement client-side permission trust; authorization must be checked server-side.
4) Dashboard route structure:
   - Prepare protected route structure for /dashboard and /dashboard/:guildId.
   - Show the eight systems as navigation/cards with availability states. Because actual bot API integration is not yet implemented, mark systems "قريباً" and do not imply they are operational.
   - Systems: الترحيب، المستويات، الرد التلقائي، الإشراف، الإمبيدات، الرتب التفاعلية، الأوامر، السجلات.
   - Each system should have a distinct page shell ready for later real API integration; no fake controls that claim to save settings.
5) Add sensible not-found, loading, and error states.

TECHNICAL EXPECTATIONS
- Use the default Lovable full-stack TypeScript stack, Tailwind, and shadcn/ui components where useful.
- Keep UI components, route/page logic, and server integration layers separated.
- Use semantic components, reusable design tokens, and maintainable file structure.
- Keep Discord OAuth2 logic server-side. Use state validation, secure HttpOnly/SameSite cookies for sessions, and server-side token handling. Do not store access tokens in localStorage/sessionStorage.
- Do not create a database or connect an external service yet. Do not invent credentials, bot IDs, API URLs, guild data, or status data.
- Add a clear typed configuration boundary for the eventual Discord client ID, client secret, redirect URI, bot invite URL/permissions, and backend API base URL, using environment variables and safe missing-config handling. Never put secrets in VITE_ or NEXT_PUBLIC_ variables.
- Do not publish/deploy the project.
- Prioritize implementing the polished landing page and complete visual navigation/route skeleton now. Keep all visible copy in formal Arabic.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/99559357-085c-4cd2-b951-9348b0d8b641).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
