$ErrorActionPreference = 'Stop'
$nginxRoot = Join-Path $PSScriptRoot 'nginx'
$nginxExe = Join-Path $nginxRoot 'nginx.exe'

if (-not (Test-Path -LiteralPath $nginxExe)) {
    throw "Nginx executable not found: $nginxExe"
}

Push-Location $nginxRoot
try {
    & .\nginx.exe -t
    if ($LASTEXITCODE -ne 0) {
        throw 'Nginx configuration test failed.'
    }

    $running = Get-Process -Name nginx -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq $nginxExe }
    if ($running) {
        Write-Output 'Nginx is already running.'
    } else {
        Start-Process -FilePath $nginxExe -WorkingDirectory $nginxRoot -WindowStyle Hidden
        Start-Sleep -Seconds 1
        $running = Get-Process -Name nginx -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq $nginxExe }
        if (-not $running) {
            throw 'Nginx failed to start. Port 80 may be occupied or require administrator privileges.'
        }
        Write-Output 'Nginx started.'
    }

    Write-Output 'Frontend: http://localhost'
    Write-Output 'Backend proxy: /api/* -> http://127.0.0.1:8080'
} finally {
    Pop-Location
}