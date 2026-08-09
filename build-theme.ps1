param(
	[string]$ThemeDir = "RARC-Theme",
	[string]$PackageDir = "rarc-theme",
	[string]$ZipPath = ""
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

if (-not $ZipPath) {
	$ZipPath = "$ThemeDir-$nextVersion.zip"
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipFullPath = Join-Path -Path $PSScriptRoot -ChildPath $ZipPath
$latestZipFullPath = Join-Path -Path $PSScriptRoot -ChildPath "$ThemeDir.zip"

foreach ($existingZipPath in @($zipFullPath, $latestZipFullPath, (Join-Path -Path $PSScriptRoot -ChildPath "rarc-theme.zip"))) {
	if (Test-Path -LiteralPath $existingZipPath) {
		Remove-Item -LiteralPath $existingZipPath -Force
	}
}

$stagingRoot = Join-Path -Path $PSScriptRoot -ChildPath ".build-theme-staging"

if (Test-Path -LiteralPath $stagingRoot) {
	Remove-Item -LiteralPath $stagingRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $stagingRoot | Out-Null

$stagedThemeRoot = Join-Path -Path $stagingRoot -ChildPath $PackageDir
New-Item -ItemType Directory -Path $stagedThemeRoot | Out-Null

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
	$destinationPath = Join-Path -Path $stagedThemeRoot -ChildPath $relativePath

	if (-not (Test-Path -LiteralPath $sourcePath)) {
		throw "Required theme path missing: $sourcePath"
	}

	Copy-Item -Path $sourcePath -Destination $destinationPath -Recurse -Force
}

$zipStream = [System.IO.File]::Open($zipFullPath, [System.IO.FileMode]::Create)
$archive = New-Object System.IO.Compression.ZipArchive($zipStream, [System.IO.Compression.ZipArchiveMode]::Create, $false)

Get-ChildItem -LiteralPath $stagingRoot -Recurse -Directory | ForEach-Object {
	$entryName = $_.FullName.Substring($stagingRoot.Length + 1).Replace('\', '/') + '/'
	$archive.CreateEntry($entryName) | Out-Null
}

Get-ChildItem -LiteralPath $stagingRoot -Recurse -File | ForEach-Object {
	$entryName = $_.FullName.Substring($stagingRoot.Length + 1).Replace('\', '/')
	[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
}

$archive.Dispose()
$zipStream.Dispose()

Remove-Item -LiteralPath $stagingRoot -Recurse -Force

$requiredEntries = @(
	"$PackageDir/style.css",
	"$PackageDir/functions.php",
	"$PackageDir/theme.json",
	"$PackageDir/templates/index.html"
)

function Test-RarcThemeZip($PathToVerify) {
	$verifyStream = [System.IO.File]::OpenRead($PathToVerify)
	$verifyArchive = New-Object System.IO.Compression.ZipArchive($verifyStream, [System.IO.Compression.ZipArchiveMode]::Read, $false)
	$entryNames = @($verifyArchive.Entries | ForEach-Object { $_.FullName })

	foreach ($requiredEntry in $requiredEntries) {
		if ($entryNames -notcontains $requiredEntry) {
			$verifyArchive.Dispose()
			$verifyStream.Dispose()
			throw "Invalid WordPress theme ZIP: missing $requiredEntry"
		}
	}

	if ($entryNames -contains "style.css") {
		$verifyArchive.Dispose()
		$verifyStream.Dispose()
		throw "Invalid WordPress theme ZIP: style.css is at ZIP root instead of $PackageDir/style.css"
	}

	$verifyArchive.Dispose()
	$verifyStream.Dispose()

	$extractRoot = Join-Path -Path ([System.IO.Path]::GetTempPath()) -ChildPath "rarc-theme-zip-test-$([guid]::NewGuid())"
	New-Item -ItemType Directory -Path $extractRoot | Out-Null

	try {
		[System.IO.Compression.ZipFile]::ExtractToDirectory($PathToVerify, $extractRoot)
		$extractedStylePath = Join-Path -Path $extractRoot -ChildPath "$PackageDir\style.css"
		$extractedIndexPath = Join-Path -Path $extractRoot -ChildPath "$PackageDir\templates\index.html"

		if (-not (Test-Path -LiteralPath $extractedStylePath)) {
			throw "Invalid WordPress theme ZIP after extraction: missing $PackageDir\style.css"
		}

		if (-not (Test-Path -LiteralPath $extractedIndexPath)) {
			throw "Invalid WordPress theme ZIP after extraction: missing $PackageDir\templates\index.html"
		}

		$extractedStyleContent = [System.IO.File]::ReadAllText($extractedStylePath)

		if ($extractedStyleContent -notmatch '(?m)^Theme Name:\s*.+' -or $extractedStyleContent -notmatch '(?m)^Version:\s*.+' ) {
			throw "Invalid WordPress theme ZIP after extraction: style.css is missing required theme headers"
		}
	} finally {
		if (Test-Path -LiteralPath $extractRoot) {
			Remove-Item -LiteralPath $extractRoot -Recurse -Force
		}
	}
}

Test-RarcThemeZip $zipFullPath
Copy-Item -LiteralPath $zipFullPath -Destination $latestZipFullPath -Force
Test-RarcThemeZip $latestZipFullPath

$hash = (Get-FileHash -LiteralPath $zipFullPath -Algorithm SHA256).Hash

"Built $zipFullPath"
"Also refreshed $latestZipFullPath"
"Theme version: $nextVersion"
"Package folder: $PackageDir"
"Verified WordPress theme ZIP entries: $($requiredEntries -join ', ')"
"SHA256: $hash"
