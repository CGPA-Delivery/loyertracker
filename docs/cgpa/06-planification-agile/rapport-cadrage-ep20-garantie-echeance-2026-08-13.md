# Rapport de cadrage — EP-20 : Paiement d’une échéance par garantie locative

**Date :** 2026-08-13
**Nature :** audit et conception uniquement; aucun code, migration, environnement ou appel fournisseur.

## État de la story

- Épic proposée : **EP-20** (EP-19 est déjà réservé au suivi de délivrabilité Resend).
- Stories canoniques : **EP20-US01 à EP20-US06** (les IDs historiques Lot 6 UX `US-148→151` sont préservés).
- Décision PO/CDO : **GO / EP20_IMPLEMENTATION_READY**, effectif seulement après fusion humaine de la décision documentaire.
- Réserves : **DÉCIDÉES** — `PARTIEL` sans document certifié, une retenue par échéance, `bien_id` persistant et templates WhatsApp/SMS. Référence : `decision-pocdo-ep20-garantie-2026-08-13.md`.

## Écart critique constaté

La retenue garantie vérifie bien le reste dû mais remplace actuellement `montant_recu` au lieu de le cumuler et compare la retenue seule au montant attendu pour statuer. Un encaissement préalable de 400 puis une retenue de 600 sur 1 000 conduit donc à `PARTIEL`/600 au lieu de `RECU`/1 000. La correction est bloquée jusqu’au GO, car elle touche l’intégrité financière et la concurrence.

## Limites maintenues

Aucun déploiement Staging/Production, aucune activation Twilio, aucun secret, aucun n8n/broker, aucune modification de migration existante et aucune clôture de Gate n’est induit.
