$ErrorActionPreference = 'Stop'
if (-not (Test-Path (Join-Path $PSScriptRoot 'node_modules\vite\bin\vite.js'))) {
    throw 'Dependencies are not installed. Run the pnpm install command from README.md first.'
}
& node (Join-Path $PSScriptRoot 'node_modules\vite\bin\vite.js') build