param(
	[string]$ThemeDir = "RARC-Theme",
	[string]$ZipPath = "rarc-theme.zip"
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

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipFullPath = Join-Path -Path $PSScriptRoot -ChildPath $ZipPath
if (Test-Path -LiteralPath $zipFullPath) {
	Remove-Item -LiteralPath $zipFullPath -Force
}

$stagingRoot = Join-Path -Path $PSScriptRoot -ChildPath ".build-theme-staging"

if (Test-Path -LiteralPath $stagingRoot) {
	Remove-Item -LiteralPath $stagingRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $stagingRoot | Out-Null

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
	$destinationPath = Join-Path -Path $stagingRoot -ChildPath $relativePath
	Copy-Item -Path $sourcePath -Destination $destinationPath -Recurse -Force
}

$zipStream = [System.IO.File]::Open($zipFullPath, [System.IO.FileMode]::Create)
$archive = New-Object System.IO.Compression.ZipArchive($zipStream, [System.IO.Compression.ZipArchiveMode]::Create, $false)

Get-ChildItem -LiteralPath $stagingRoot -Recurse -File | ForEach-Object {
	$entryName = $_.FullName.Substring($stagingRoot.Length + 1).Replace('\', '/')
	[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
}

$archive.Dispose()
$zipStream.Dispose()

Remove-Item -LiteralPath $stagingRoot -Recurse -Force

"Built $zipFullPath"
"Theme version: $nextVersion"
