export type UserRole = "user" | "teamer" | "admin";

export type EventStatus = "ACTIVE" | "INACTIVE";

export type TeamApplicationStatus = "NOT_OPEN" | "OPTIONAL" | "REQUIRED";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type QuestionType = "text" | "multipleChoice" | "checkbox" | "number";

export type State =
  | "Brandenburg"
  | "Berlin"
  | "Baden-Württemberg"
  | "Bayern"
  | "Bremen"
  | "Hessen"
  | "Hamburg"
  | "Mecklenburg-Vorpommern"
  | "Niedersachsen"
  | "Nordrhein-Westfalen"
  | "Rheinland-Pfalz"
  | "Schleswig-Holstein"
  | "Saarland"
  | "Sachsen"
  | "Sachsen-Anhalt"
  | "Thüringen"
  | "-";

export type Allergen =
  | "Gluten"
  | "Crabs"
  | "Eggs"
  | "Fish"
  | "Peanuts"
  | "Soy"
  | "Milk"
  | "Nuts"
  | "Celery"
  | "Mustard"
  | "Sesame"
  | "SulphurDioxide"
  | "Lupine"
  | "Molluscs";

export type BahnCard = "None" | "BahnCard25" | "BahnCard50" | "BahnCard100";

export type Grade =
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "Graduate";

export type Title = "Mr" | "Mrs";
