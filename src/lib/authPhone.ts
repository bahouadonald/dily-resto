export function telephoneVersEmail(telephone: string): string {
  const chiffres = telephone.replace(/\D/g, "");
  return `${chiffres}@dily-resto.app`;
}
