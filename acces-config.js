/* ==========================================================
   Configuration du cadenas de l'administration
   ----------------------------------------------------------
   • sel        : valeur aléatoire (empêche les « tables précalculées »)
   • empreinte  : « empreinte » PBKDF2 du mot de passe (hex, 64 caractères).
                  Le mot de passe lui-même n'existe ici NULLE PART :
                  on ne peut pas le reconstituer à partir de l'empreinte.
                  Poignée de secours : mettre empreinte: ''  →  l'écran
                  de création revient. À garder STRICTEMENT pour vous.
   • iterations : coût volontaire du calcul — plus il est grand,
                  plus toute tentative de force brute est lente.
   ========================================================== */
window.ACCES_ADMIN = {
  sel: '823ffea84bfca50c0aeb03e979332eaa',
  empreinte: '6c53e1992408a4b8a6ad3c6893ed26ca82da5cb9ba35bd72682a8e7818c9e3bb',
  iterations: 120000
};
