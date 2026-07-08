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

$stagingRoot = Join-Path -Path $PSScriptRoot -ChildPath ".build-theme-staging"
$stagingThemeRoot = Join-Path -Path $stagingRoot -ChildPath $ThemeDir

if (Test-Path -LiteralPath $stagingRoot) {
	Remove-Item -LiteralPath $stagingRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $stagingThemeRoot | Out-Null

$pathsToZip = @(
	"assets"
	"parts"
	"patterns"
	"templates"
	"functions.php"
	"screenshot.png"
	"style.css"
	"theme.json"
)

foreach ($relativePath in $pathsToZip) {
	$sourcePath = Join-Path -Path $themeRoot -ChildPath $relativePath
	$destinationPath = Join-Path -Path $stagingThemeRoot -ChildPath $relativePath
	Copy-Item -Path $sourcePath -Destination $destinationPath -Recurse -Force
}

Push-Location -LiteralPath $stagingRoot
Compress-Archive -Path $ThemeDir -DestinationPath $zipFullPath -CompressionLevel Optimal
Pop-Location

Remove-Item -LiteralPath $stagingRoot -Recurse -Force

"Built $zipFullPath"
"Theme version: $nextVersion"
