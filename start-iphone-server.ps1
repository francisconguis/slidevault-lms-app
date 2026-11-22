# PowerShell Local Server for iPhone (No Node.js required)
$port = 8080
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -notmatch '^169\.254' } | Select-Object -First 1).IPAddress
if (-not $ip) { $ip = "localhost" }
$url = "http://${ip}:${port}"

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  SlideVault LMS - iPhone Server Running!" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Make sure your iPhone is connected to the SAME Wi-Fi as this PC." -ForegroundColor Yellow
Write-Host "2. Open Safari on your iPhone and go to:" -ForegroundColor White
Write-Host ""
Write-Host "   $url" -ForegroundColor Green
Write-Host ""
Write-Host "3. (Optional) In iPhone Safari, tap Share -> 'Add to Home Screen'" -ForegroundColor Gray
Write-Host "   to install SlideVault LMS as a full-screen iPhone app!" -ForegroundColor Gray
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor DarkGray

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:${port}/")
try {
    $listener.Start()
} catch {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:${port}/")
    $listener.Start()
    Write-Host "Note: Running on localhost only. Run PowerShell as Administrator to allow Wi-Fi access, or use npx expo start." -ForegroundColor Yellow
}

$htmlPath = Join-Path $PSScriptRoot "index.html"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $response = $context.Response
    if (Test-Path $htmlPath) {
        $bytes = [System.IO.Path]::GetExtension($htmlPath)
        $content = [System.IO.File]::ReadAllBytes($htmlPath)
        $response.ContentType = "text/html; charset=utf-8"
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
    }
    $response.OutputStream.Close()
}

