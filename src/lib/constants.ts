// Define constants for role types
export const ROLE_TYPES = {
  USER: "user" as const,
  TEAMER: "teamer" as const,
  ADMIN: "admin" as const,
};

// Define constants for event status types
export const EVENT_STATUS = {
  ACTIVE: "ACTIVE" as const,
  INACTIVE: "INACTIVE" as const,
};

// Define constants for team application status
export const TEAM_APPLICATION_STATUS = {
  NOT_OPEN: "NOT_OPEN" as const,
  OPTIONAL: "OPTIONAL" as const,
  REQUIRED: "REQUIRED" as const,
};

// Define constants for application status
export const APPLICATION_STATUS = {
  PENDING: "PENDING" as const,
  APPROVED: "APPROVED" as const,
  REJECTED: "REJECTED" as const,
};

// Define constants for question types
export const QUESTION_TYPE = {
  TEXT: "text" as const,
  MULTIPLE_CHOICE: "multipleChoice" as const,
  CHECKBOX: "checkbox" as const,
  NUMBER: "number" as const,
};

// Define constants for German states (as alternative to enum)
export const STATE = {
  BB: "Brandenburg" as const,
  BE: "Berlin" as const,
  BW: "Baden-Württemberg" as const,
  BY: "Bayern" as const,
  HB: "Bremen" as const,
  HE: "Hessen" as const,
  HH: "Hamburg" as const,
  MV: "Mecklenburg-Vorpommern" as const,
  NI: "Niedersachsen" as const,
  NW: "Nordrhein-Westfalen" as const,
  RP: "Rheinland-Pfalz" as const,
  SH: "Schleswig-Holstein" as const,
  SL: "Saarland" as const,
  SN: "Sachsen" as const,
  ST: "Sachsen-Anhalt" as const,
  TH: "Thüringen" as const,
  XX: "-" as const,
};

// Define constants for allergens (as alternative to enum)
export const ALLERGEN = {
  GLUTEN: "Gluten" as const,
  CRABS: "Crabs" as const,
  EGGS: "Eggs" as const,
  FISH: "Fish" as const,
  PEANUTS: "Peanuts" as const,
  SOY: "Soy" as const,
  MILK: "Milk" as const,
  NUTS: "Nuts" as const,
  CELERY: "Celery" as const,
  MUSTARD: "Mustard" as const,
  SESAME: "Sesame" as const,
  SULPHUR_DIOXIDE: "SulphurDioxide" as const,
  LUPINE: "Lupine" as const,
  MOLLUSCS: "Molluscs" as const,
};

// Define constants for BahnCard types (as alternative to enum)
export const BAHN_CARD = {
  NONE: "None" as const,
  BAHNCARD25: "BahnCard25" as const,
  BAHNCARD50: "BahnCard50" as const,
  BAHNCARD100: "BahnCard100" as const,
};

// Define constants for grades (as alternative to enum)
export const GRADE = {
  FIVE: "5" as const,
  SIX: "6" as const,
  SEVEN: "7" as const,
  EIGHT: "8" as const,
  NINE: "9" as const,
  TEN: "10" as const,
  ELEVEN: "11" as const,
  TWELVE: "12" as const,
  THIRTEEN: "13" as const,
  GRADUATE: "Graduate" as const,
};

// Define constants for titles (as alternative to enum)
export const TITLE = {
  MR: "Mr" as const,
  MRS: "Mrs" as const,
};
