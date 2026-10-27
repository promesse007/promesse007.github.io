// ============================================================
// neon.ts — Infrastructure de « l'album de mariage Josiane & Armand »
// Projet Neon : album-mariage-josiane-armand (small-shadow-12631119)
// • un Function Hono « souvenirs » : dépôt par les invités (en attente),
//   lecture publique (publiés), modération par l'administrateur (secret).
// Les photos sont gardées dans la base (bytea) pour l'instant ;
// l'Object Storage Neon est possible plus tard sans tout refaire.
// ============================================================
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  functions: {
    souvenirs: {
      name: "Souvenirs des invités (API)",
      source: "api/souvenirs.ts",
      env: {
        // ∅ DEFINI DANS .env (git-ignoré) : clé que seule l'administration connaît
        ADMIN_SECRET: process.env.ADMIN_SECRET!,
      },
    },
  },
});
