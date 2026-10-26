# ============================================================
#  ENVOYER LE SITE SUR GITHUB (pour Render)
#  ------------------------------------------------------------
#  Utilisation :
#    1. Créez le dépôt sur github.com (bouton « New repository »,
#       nommez-le par exemple  mariage-album, Public, sans README).
#    2. Copiez l'adresse obtenue (elle ressemble à
#       https://github.com/votre-nom/mariage-album.git)
#    3. Clic droit ici dans le dossier → « Ouvrir la fenêtre
#       PowerShell » et lancez :  .\envoyer-sur-github.ps1
#    4. Collez l'adresse_demandée, puis laissez-vous guider.
# ============================================================

Clear-Host
Set-Location -Path $PSScriptRoot

Write-Host ""
Write-Host "Envoi du site  Souvenirs de notre mariage  vers GitHub" -ForegroundColor Magenta
Write-Host ""

# 1. l'adresse du depot
$adresse = Read-Host "Collez ici la derniere adresse du depot GitHub ex https://github.com/votre-nom/mariage-album.git"
if ([string]::IsNullOrWhiteSpace($adresse)) {
  Write-Host "Aucune adresse fournie. Fin." -ForegroundColor Red
  exit
}

# 2. on établit la connexion (remplace l'ancienne si elle existe)
git remote remove origin 2>$null
git remote add origin $adresse.Trim()
if ($LASTEXITCODE -ne 0) { Write-Host "Probleme avec git. Fin." -ForegroundColor Red; exit }

# 3. tout envoyer (une premiere filiation ou une mise a jour)
Write-Host ""
git push -u origin master
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "L'envoi n'a pas abouti. Motifs habituels :" -ForegroundColor Yellow
  Write-Host "- une fenetre de connexion GitHub est peut-etre restee ouverte ;"
  Write-Host "- ou le depot GitHub n'est pas vide : retentez la commande suivante :"
  Write-Host "    git push -u origin master --force"
  exit 1
}

Write-Host ""
Write-Host "Terminez le site a etudie le site pour le deploiement sur Render :" -ForegroundColor Green
Write-Host "  render.com  ->  New  ->  Static Site  ->  votre depot"
Write-Host "  Build command : (ne rien ecrire)"
Write-Host "  Publish directory : ."
