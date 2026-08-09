# Décision proposée — Bugs et matrice de traçabilité

**Date :** 2026-08-09  
**Statut :** proposition PO/CDO — validation humaine requise  
**Cadre :** CGPA v6.1.1  
**Release protégée :** `v1.17.0-rc.1` sous hypercare

## 1. Constat

Après validation des points 1 et 2, l’audit reste incomplet sans :

1. un registre normatif des bugs, dettes, réserves et dérives ;
2. une matrice unique de traçabilité Story/Bug vers les preuves de livraison.

Les preuves sont largement présentes mais dispersées. Il n’existe pas encore de table complète story-par-story consolidée.

## 2. Décision proposée

> Le PO/CDO valide la création et la maintenance de :
>
> - `registre-bugs-defauts-2026-08-09.md` ;
> - `matrice-tracabilite-story-bug-2026-08-09.md`.
>
> Les éléments `BUG-CAND-*`, `DOC-CAND-*` et `DEBT-CAND-*` sont des candidats à qualifier, et non des bugs définitivement acceptés. Toute criticité P0/P1 doit recevoir une décision humaine, un responsable, une échéance/Gate cible et une preuve de clôture attendue.
>
> La matrice doit utiliser `EP-xx/US-yyy` comme clé normative pour les collisions et ne jamais déduire une preuve absente d’un statut de lot ou de release.

## 3. Triage initial proposé

- `BUG-CAND-001` — mot de passe oublié Keycloak : **Majeur, P0 à confirmer**.
- `BUG-CAND-002` — invitation sans parcours Angular : **Majeur, P1**.
- `BUG-CAND-003` — couverture RGPD `notification_*` : **Majeur, P1 à confirmer**.
- `BUG-CAND-004` — archivage Bien sans garde active : **Majeur, P1**.
- `BUG-CAND-005` — dépendances Dependabot dev-scope : **P2 par défaut, P1 si exposition runtime confirmée**.
- dérives `DOC-CAND-001→003` : **P1 documentaire**, sans impact direct Production tant que l’état courant est explicitement rétabli.

Ce triage est une recommandation d’audit et doit être confirmé ou modifié par le PO/CDO.

## 4. Décision de périmètre

La décision proposée est :

```text
GO documentaire sous gel applicatif
NO GO fonctionnel pendant l’hypercare
```

Autorisés :

- compléter les preuves et liens de la matrice ;
- corriger les dérives documentaires de façon additive ;
- qualifier les bugs et produire les plans de remédiation ;
- rattacher les dettes aux IDs qualifiés et Gates futurs.

Interdits par cette décision seule :

- code applicatif ou correctif bug ;
- migration Flyway ;
- Staging ou Production ;
- activation Resend/webhook/provider ;
- secret, Docker ou observabilité critique ;
- lancement EP-19 ;
- renumérotation destructive.

## 5. Validation attendue

Jordan Tshilombo, PO/CDO, est invité à valider ou amender :

1. la création du registre Bugs normatif ;
2. la matrice normative unique ;
3. le triage initial P0/P1/P2 ;
4. le statut `GO documentaire / NO GO fonctionnel` pendant l’hypercare.

Les avis des sous-agents restent des avis techniques et ne constituent pas la validation humaine.
