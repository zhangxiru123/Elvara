# Elvara Frontend

React + Tailwind CSS + Framer Motion login and registration surface.

## Stack

- React 19
- Vite 7
- Tailwind CSS 4
- Framer Motion
- Nginx on port 80
- Spring Boot API on port 8080

## Layout

- Desktop: 65% deep-sea brand panel on the left, 35% form panel on the right.
- Mobile below 768px: the brand panel is hidden and the form uses the full viewport.
- Both login and registration use the same right-side form area.
- The page is fixed to 100vh and never scrolls.

## Install

From `D:\web-code\Elvara-front`:

```powershell
& 'C:\Users\29446\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' `
  'C:\Users\29446\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\pnpm\bin\pnpm.cjs' install
```

If `pnpm` is already on your PATH, `pnpm install` is enough.

## Development

```powershell
.\dev.ps1
```

Vite runs on `http://127.0.0.1:5173` and proxies `/api/*` to
`http://127.0.0.1:8080`.

## Production build

```powershell
.\build.ps1
```

The output is written to `dist`. The bundled local Nginx serves that folder.

## Start and stop Nginx

```powershell
.\start-nginx.ps1
```

Open:

```text
http://localhost
```

Stop:

```powershell
.\stop-nginx.ps1
```

Nginx executable:

```text
D:\web-code\Elvara-front\nginx\nginx.exe
```

Nginx configuration:

```text
D:\web-code\Elvara-front\nginx\conf\elvara.conf
```

Routes:

- `/` serves the React build from `dist`
- `/api/*` proxies to Spring Boot `127.0.0.1:8080`
- `/ws/*` proxies WebSocket traffic to `127.0.0.1:8080`

## API contract

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/user/login` | Login with account and password |
| `POST` | `/api/user/register` | Create an account |

The page expects the project's existing `Result` response shape:

```json
{
  "code": 1,
  "msg": null,
  "data": {
    "token": "jwt-token",
    "user": {}
  }
}
```

The backend is intentionally left for the project owner to finish. If it is not
running, the page renders normally but API requests fail.

## Security note

The current development login sends the password as plaintext JSON. Replace
this with the final transport encryption strategy and terminate TLS before
deployment.