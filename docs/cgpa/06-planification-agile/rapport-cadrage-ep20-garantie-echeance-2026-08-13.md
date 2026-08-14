# Rapport de cadrage — EP-20 : Paiement d’une échéance par garantie locative

**Date :** 2026-08-13
**Nature :** audit et conception uniquement; aucun code, migration, environnement ou appel fournisseur.

## État de la story

- Épic proposée : **EP-20** (EP-19 est déjà réservé au suivi de délivrabilité Resend).
- Stories proposées : **US-148 à US-153**.
- Décision : **NO GO applicatif** jusqu’à décision PO/CDO sur le Plan d’Exécution et le traitement documentaire de `PARTIEL`.
- Réserves ouvertes :
  - `RSV-EP20-PARTIEL-01` — choisir explicitement le reçu partiel certifié distinct recommandé, ou exclure explicitement un document pour `PARTIEL`.
  - `RSV-EP20-CARDINALITE-02` — décider « une retenue par paiement » ou « plusieurs retenues append-only » avant toute migration/implémentation.
  - `RSV-EP20-NOTIF-03` — persister `bien_id` pour ReBAC historique et approuver le template SMS avant de revendiquer un fallback WhatsApp→SMS.

## Écart critique constaté

La retenue garantie vérifie bien le reste dû mais remplace actuellement `montant_recu` au lieu de le cumuler et compare la retenue seule au montant attendu pour statuer. Un encaissement préalable de 400 puis une retenue de 600 sur 1 000 conduit donc à `PARTIEL`/600 au lieu de `RECU`/1 000. La correction est bloquée jusqu’au GO, car elle touche l’intégrité financière et la concurrence.

## Limites maintenues

Aucun déploiement Staging/Production, aucune activation Twilio, aucun secret, aucun n8n/broker, aucune modification de migration existante et aucune clôture de Gate n’est induit.
