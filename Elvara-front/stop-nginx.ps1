$ErrorActionPreference = 'Stop'
$nginxRoot = Join-Path $PSScriptRoot 'nginx'
$nginxExe = Join-Path $nginxRoot 'nginx.exe'
$pidFile = Join-Path $nginxRoot 'logs\nginx.pid'

if (-not (Test-Path -LiteralPath $nginxExe)) {
    throw "Nginx executable not found: $nginxExe"
}

$running = @(Get-Process -Name nginx -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq $nginxExe })
if ($running.Count -eq 0) {
    if (Test-Path -LiteralPath $pidFile) {
        Remove-Item -LiteralPath $pidFile -Force
    }
    Write-Output 'Nginx is not running.'
    return
}

Push-Location $nginxRoot
try {
    & .\nginx.exe -s quit 2>$null
    Start-Sleep -Seconds 1

    $remaining = @(Get-Process -Name nginx -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq $nginxExe })
    if ($remaining.Count -gt 0) {
        $remaining | Stop-Process -Force
    }

    if (Test-Path -LiteralPath $pidFile) {
        Remove-Item -LiteralPath $pidFile -Force
    }
    Write-Output 'Nginx stopped.'
} finally {
    Pop-Location
}