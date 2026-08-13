# SEC-SMTP-01 — Remédiation d'exposition SMTP et rotation de credentials

| Champ | Valeur |
|---|---|
| Date | 2026-08-13 |
| Statut | **Remédiation en cours — secrets retirés du code source** |
| Déclencheur | Identifiants du relais SMTP trouvés versionnés dans le Compose Production |
| Mesure immédiate | Rotation des credentials réalisée par le CDO ; anciens credentials considérés révoqués/compromis |
| Périmètre | Relais Postfix SES et configuration SMTP Keycloak DD-EP17-14 |

## Mesures appliquées

1. Le Compose Production ne contient plus d'endpoint ni d'identifiant SMTP : il exige désormais `SES_SMTP_RELAY_HOST`, `SES_SMTP_RELAY_USERNAME` et `SES_SMTP_RELAY_PASSWORD` depuis `.env` local.
2. Les defaults SMTP d'identifiant/endpoint ont été retirés du Compose Staging.
3. Les nouveaux credentials ont été injectés comme données locales uniquement dans les `.env` Staging et Production ; permissions confirmées `0600`.
4. Le transfert temporaire de credentials vers Staging a été effacé après injection.
5. Aucune valeur de credential n'est incluse dans ce document, le Compose, les exemples, les logs ni les artefacts Git.

## Contrôles

| Contrôle | Résultat |
|---|---:|
| Recherche des anciens indicateurs dans les fichiers suivis | PASS — aucune occurrence restante |
| Contrat statique one-shot/rollback SMTP Production | PASS |
| API/Web/Keycloak/PostgreSQL Staging | Healthy avant test de rotation |
| API/Web/Keycloak/PostgreSQL Production | Healthy avant test de rotation |
| Variables SMTP locales requises sur les deux hôtes | Présentes, sans exposition de valeur |
| Mode des `.env` | `0600` |

## Validation Staging après rotation

| Contrôle | Résultat |
|---|---:|
| Compose Staging avec les nouveaux credentials locaux | PASS — interpolation Compose sans avertissement |
| One-shot SMTP Keycloak | PASS — objet `smtpServer` appliqué atomiquement et relu avec les clés requises |
| Compte existant — mot de passe oublié | HTTP `200`, message générique |
| Compte inexistant — mot de passe oublié | HTTP `200`, message générique identique |
| Anti-énumération | **PASS** |
| Logs Keycloak post-test | PASS — aucun échec SMTP / envoi e-mail détecté |
| Isolation des services Staging | PASS — API, Nginx, Keycloak et PostgreSQL restent healthy |

## Suites obligatoires

- Fusionner cette remédiation avant d'utiliser le Compose Production sécurisé.
- Ne redéployer `smtp-relay` Production qu'après CI verte et Gate SMTP Production explicite.
- Le secret historique Git ne doit pas être traité par réécriture destructive sans décision dédiée ; la rotation réduit immédiatement le risque opérationnel.
