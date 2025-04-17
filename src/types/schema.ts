import { z } from "zod";
import {
  ROLE_TYPES,
  EVENT_STATUS,
  TEAM_APPLICATION_STATUS,
  APPLICATION_STATUS,
  QUESTION_TYPE,
  STATE,
  ALLERGEN,
  BAHN_CARD,
  GRADE,
  TITLE,
} from "./index";

/**
 * Zod schemas for runtime validation
 */

// Helper function to create a union of literals from a constant object
const createUnionSchema = <T extends Record<string, string>>(obj: T) => {
  const literals = Object.values(obj).map((val) => z.literal(val));
  // We need at least two elements for a union, if only one exists, return it directly
  if (literals.length === 0) {
    return z.string();
  }
  if (literals.length === 1) {
    return literals[0];
  }
  return z.union(
    literals as [
      z.ZodLiteral<string>,
      z.ZodLiteral<string>,
      ...z.ZodLiteral<string>[],
    ],
  );
};

// Engagement schema
export const engagementSchema = z.object({
  title: z.string(),
  description: z.string(),
});

// Engagement item schema - used in original design
export const engagementItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Profile schema
export const profileSchema = z.object({
  id: z.string().uuid().optional(),
  title: createUnionSchema(TITLE).optional(),
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  additionalNames: z.string().optional(),
  dateOfBirth: z.string().optional(),
  birthPlace: z.string().optional(),
  birthCountry: z.string().optional(),
  birthName: z.string().optional(),
  grade: createUnionSchema(GRADE).optional(),
  mobile: z.string().optional(),
  mobileCountryCode: z.string().optional(),
  phone: z.string().optional(),
  phoneCountryCode: z.string().optional(),
  country: z.string().optional(),
  state: createUnionSchema(STATE).optional(),
  city: z.string().optional(),
  street: z.string().optional(),
  houseNo: z.string().optional(),
  postalCode: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactNumberCountryCode: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  engagement: z.array(engagementSchema).optional(),
  foodPreference: z.string().optional(),
  allergies: z.array(createUnionSchema(ALLERGEN)).optional(),
  bahnCard: createUnionSchema(BAHN_CARD).optional(),
  schoolId: z.string().uuid().optional(),
  languages: z.array(z.string()).optional(),
  socialSecurityNumber: z.string().optional(),
  iban: z.string().optional(),
  bic: z.string().optional(),
  placeOfBirth: z.string().optional(),
  hasDriverLicense: z.boolean().optional(),
  driverLicenseNumber: z.string().optional(),
  driverLicenseClass: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// User role schema
export const userRoleSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  role: z.union([
    z.literal(ROLE_TYPES.USER),
    z.literal(ROLE_TYPES.TEAMER),
    z.literal(ROLE_TYPES.ADMIN),
  ]),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Team preference option schema
export const teamPreferenceOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

// Question schema
export const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.union([
    z.literal(QUESTION_TYPE.TEXT),
    z.literal(QUESTION_TYPE.MULTIPLE_CHOICE),
    z.literal(QUESTION_TYPE.CHECKBOX),
    z.literal(QUESTION_TYPE.NUMBER),
    z.string(),
  ]),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

// Event schema
export const eventSchema = z.object({
  id: z.string().uuid().optional(),
  nameDe: z.string(),
  nameEn: z.string(),
  locationDe: z.string(),
  locationEn: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  deadline: z.string(),
  minAge: z.number().optional(),
  statusInternal: z.union([
    z.literal(EVENT_STATUS.ACTIVE),
    z.literal(EVENT_STATUS.INACTIVE),
    z.string(),
  ]),
  statusExternal: z.union([
    z.literal(EVENT_STATUS.ACTIVE),
    z.literal(EVENT_STATUS.INACTIVE),
    z.string(),
  ]),
  shortcut: z.string().optional(),
  bahnCardRequired: z.boolean().optional(),
  languagesRequired: z.array(z.string()).optional(),
  departureStationRequired: z.boolean().optional(),
  teamPreferenceOptions: z.array(teamPreferenceOptionSchema).optional(),
  emergencyContactRequired: z.boolean().optional(),
  teamApplicationRequired: z.union([
    z.literal(TEAM_APPLICATION_STATUS.NOT_OPEN),
    z.literal(TEAM_APPLICATION_STATUS.OPTIONAL),
    z.literal(TEAM_APPLICATION_STATUS.REQUIRED),
    z.string(),
  ]),
  questions: z.record(z.string(), questionSchema).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Skill schema
export const skillSchema = z.object({
  id: z.string(),
  category: z.string(),
  level: z.number(),
});

// Team preference schema
export const teamPreferenceSchema = z.object({
  optionId: z.string(),
  rank: z.number(),
});

// Application schema
export const applicationSchema = z.object({
  id: z.string().uuid().optional(),
  engagement: z.array(engagementSchema).optional(),
  bahnCard: createUnionSchema(BAHN_CARD).optional(),
  departureStation: z.string().optional(),
  skills: z.array(skillSchema).optional(),
  teamPreference: z.array(teamPreferenceSchema).optional(),
  recommendation: z.string().optional(),
  leadsource: z.string().optional(),
  status: z.union([
    z.literal(APPLICATION_STATUS.PENDING),
    z.literal(APPLICATION_STATUS.APPROVED),
    z.literal(APPLICATION_STATUS.REJECTED),
    z.string(),
  ]),
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
  answers: z.record(z.string(), z.any()).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// School schema
export const schoolSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  state: createUnionSchema(STATE).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
  houseNo: z.string().optional(),
  postalCode: z.string().optional(),
  isVerified: z.boolean(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
