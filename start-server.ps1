# PowerShell script to start HTTP server
$port = 8000
$path = Get-Location

Write-Host "Starting HTTP server on port $port..." -ForegroundColor Green
Write-Host "Website will be available at: http://localhost:$port" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""

# Try Python first
try {
    python -m http.server $port
} catch {
    # If Python fails, try Python3
    try {
        python3 -m http.server $port
    } catch {
        Write-Host "Python not found. Trying alternative method..." -ForegroundColor Red
        # Alternative: Use .NET HttpListener
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add("http://localhost:$port/")
        $listener.Start()
        Write-Host "Server started at http://localhost:$port" -ForegroundColor Green
        
        while ($listener.IsListening) {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            $localPath = $request.Url.LocalPath
            if ($localPath -eq "/") { $localPath = "/index.html" }
            
            $filePath = Join-Path $path $localPath.TrimStart('/')
            
            if (Test-Path $filePath) {
                $content = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $content.Length
                $response.OutputStream.Write($content, 0, $content.Length)
            } else {
                $response.StatusCode = 404
                $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.OutputStream.Write($notFound, 0, $notFound.Length)
            }
            
            $response.Close()
        }
    }
}

