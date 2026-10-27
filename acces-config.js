/* ==========================================================
   Configuration du cadenas de l'administration
   ----------------------------------------------------------
   • sel        : valeur aléatoire (empêche les « tables précalculées »)
   • empreinte  : « empreinte » PBKDF2 du mot de passe (hex, 64 caractères)
                  VIDE ici  → à la première ouverture, la page propose
                  de CRÉER le mot de passe, puis de télécharger ce
                  fichier mis à jour (et de remplacer celui-ci).
   • iterations : coût volontaire du calcul — plus il est grand,
                  plus toute tentative de force brute est lente.
   Le mot de passe lui-même n'existe NULLE PART : ni ici ni ailleurs.
   ========================================================== */
window.ACCES_ADMIN = {
  sel: '823ffea84bfca50c0aeb03e979332eaa',
  empreinte: '',
  iterations: 120000
};
