package com.loyertracker.quittances;

/** Exemplaire public autorisé, accompagné uniquement de sa période certifiée de téléchargement. */
public record QuittanceTelechargee(byte[] pdf, String periode) {
}
