-- EP20-US02 : une retenue de garantie ne peut référencer qu'un seul paiement.
-- La sérialisation transactionnelle du paiement protège le cas de deux mouvements concurrents.
CREATE UNIQUE INDEX uq_paiement_garantie_movement_id
    ON paiement (garantie_movement_id)
    WHERE garantie_movement_id IS NOT NULL;
