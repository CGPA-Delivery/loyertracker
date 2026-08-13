# Gate Production — réinstruction contrôlée SMTP Keycloak (DD-EP17-14)

| Champ | Valeur |
|---|---|
| Date | 2026-08-13 |
| Production canonique | `18.158.70.88` — `loyertracker.loyerpro.org` |
| Source/runtime | `main` `68753b671747`; verrou release cohérent sur les artefacts `sha-d19c4fea` |
| Référence mécanisme | PR #474 (`ed4a935`), CI SUCCESS, fusionnée |
| Nature | Validation du runtime SMTP déjà actif — **pas une nouvelle activation** |
| Décision actuelle | **GO technique pour test fonctionnel contrôlé, sous fenêtre et GO CDO distincts** |

## 1. État constaté en lecture seule

| Contrôle | Résultat |
|---|---:|
| Checkout hôte / `origin/main` | PASS — `68753b671747` |
| `.env` local | PASS — permissions `0600`; seules les clés requises sont présentes |
| Release lock / Flyway | PASS — cohérent / `32` |
| API, Nginx, Keycloak, PostgreSQL, relais SMTP | PASS — healthy |
| HTTPS public / Actuator | PASS — `200` / `UP` |
| OIDC client SPA public | PASS — origine, URI de redirection et web origin publics corrects |
| Relais SMTP interne | PASS — running / healthy |
| Realm Keycloak `smtpServer` | PASS — objet présent vers le relais interne ; clés non secrètes attendues présentes |
| Erreurs SMTP/e-mail Keycloak, fenêtre 30 min | PASS — aucune erreur filtrée |

## 2. Décision de périmètre

Le realm Keycloak utilise déjà le relais interne `smtp-relay` sur son port interne, sans authentification TLS à ce segment réseau. Le relais sain porte la responsabilité TLS/authentification vers le fournisseur SMTP externe.

Par conséquent, le one-shot de reconfiguration SES ne doit **pas** être exécuté : il écraserait une topologie runtime existante et saine. La présente réinstruction autorise uniquement la preuve fonctionnelle du parcours existant « mot de passe oublié ».

## 3. Préconditions impératives avant test live

1. Fenêtre UTC documentée et signal CDO explicite `GO / PRODUCTION_READY` limité au test fonctionnel ;
2. dump PostgreSQL + globals frais, hashé, validé par `pg_restore --list` juste avant la fenêtre ;
3. capture filtrée de l'objet `smtpServer` avant test et inventaire de santé/restart count ;
4. compte de test Production autorisé et `enabled=true`, sans divulgation de son identité ni de son adresse ;
5. boîte de réception de test contrôlée pour prouver la réception sans conserver mail/token/contenu dans Git ou les logs ;
6. rollback ciblé `smtpServer` prêt, mais déclenché seulement sur échec SEV-1 ou décision CDO/RM.

## 4. Preuves live requises

| Preuve | Attendu |
|---|---|
| Compte existant activé | HTTP et message générique tracés ; réception réelle confirmée |
| Action-token | mise à jour du mot de passe terminée avec succès, sans exposer le token |
| Compte synthétique inexistant | même HTTP et message normalisé que le compte existant |
| Logs / alerting | aucune erreur SMTP, e-mail, Keycloak, ni alerte SEV-1 non qualifiée |
| Santé post-test | API, Nginx, Keycloak, PostgreSQL, relais ; HTTPS / Actuator / lock conformes |

## 5. Rollback et hypercare

- Échec SMTP, anomalie anti-énumération, Keycloak indisponible >2 min, API/Web indisponible >2 min ou 5xx >5 % / 5 min : **STOP / rollback ciblé** sous décision CDO/RM.
- Aucun rebuild, aucun changement de digest, aucune recréation de stack et aucune restauration PostgreSQL automatique.
- Hypercare à consigner : T0+15 min, T+12 h ±30 min, T+24 h ±30 min. Les contrôles futurs ne peuvent pas être déclarés à l’avance.

## 6. Limite de décision

Ce document n’autorise pas un test live par lui-même. Il requiert encore une fenêtre UTC et un `GO / PRODUCTION_READY` explicite pour la validation fonctionnelle contrôlée.
