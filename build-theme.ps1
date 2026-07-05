param(
	[string]$ThemeDir = "RARC-Theme",
	[string]$ZipPath = "RARC-Theme.zip"
)

$themeRoot = Join-Path -Path $PSScriptRoot -ChildPath $ThemeDir
$stylePath = Join-Path -Path $themeRoot -ChildPath "style.css"

if (-not (Test-Path -LiteralPath $themeRoot)) {
	throw "Theme directory not found: $themeRoot"
}

if (-not (Test-Path -LiteralPath $stylePath)) {
	throw "style.css not found: $stylePath"
}

$styleContent = [System.IO.File]::ReadAllText($stylePath)
$versionMatch = [System.Text.RegularExpressions.Regex]::Match($styleContent, '(?m)^Version:\s*(\d+)\.(\d+)\.(\d+)\s*$')

if (-not $versionMatch.Success) {
	throw "Could not find semantic Version header in $stylePath"
}

$major = [int]$versionMatch.Groups[1].Value
$minor = [int]$versionMatch.Groups[2].Value
$patch = [int]$versionMatch.Groups[3].Value + 1
$nextVersion = "$major.$minor.$patch"

$updatedStyle = [System.Text.RegularExpressions.Regex]::Replace($styleContent, '(?m)^Version:\s*\d+\.\d+\.\d+\s*$', "Version: $nextVersion", 1)
[System.IO.File]::WriteAllText($stylePath, $updatedStyle, (New-Object System.Text.UTF8Encoding($false)))

$zipFullPath = Join-Path -Path $PSScriptRoot -ChildPath $ZipPath
if (Test-Path -LiteralPath $zipFullPath) {
	Remove-Item -LiteralPath $zipFullPath -Force
}

$pathsToZip = @(
	Join-Path -Path $themeRoot -ChildPath "assets"
	Join-Path -Path $themeRoot -ChildPath "parts"
	Join-Path -Path $themeRoot -ChildPath "patterns"
	Join-Path -Path $themeRoot -ChildPath "templates"
	Join-Path -Path $themeRoot -ChildPath "functions.php"
	Join-Path -Path $themeRoot -ChildPath "screenshot.png"
	Join-Path -Path $themeRoot -ChildPath "style.css"
	Join-Path -Path $themeRoot -ChildPath "theme.json"
)

Compress-Archive -Path $pathsToZip -DestinationPath $zipFullPath -CompressionLevel Optimal

"Built $zipFullPath"
"Theme version: $nextVersion"
