# Database Structure for Supabase Migration

## Overview

This document outlines the database schema for migrating from NestJS to Supabase. As requested, event_types have been merged into the events table and password resets are handled by Supabase's built-in functionality.

## Database Tables

### 1. profile

- **Primary Key**: id (UUID)
- **Fields**:

  - title (string) <!-- Frontend: Dropdown with title options (Mr, Mrs) -->
  - lastName (string) <!-- Frontend: Text input -->
  - firstName (string) <!-- Frontend: Text input -->
  - additionalNames (string) <!-- Frontend: Text input -->
  - dateOfBirth (string) <!-- Frontend: Date picker -->
  - birthPlace (string) <!-- Frontend: Text input -->
  - birthCountry (string) <!-- Frontend: Country dropdown -->
  - birthName (string) <!-- Frontend: Text input -->
  - grade (string) <!-- Frontend: Dropdown with grade options -->
  - mobile (string) <!-- Frontend: Phone input with formatting -->
  - mobileCountryCode (string) <!-- Frontend: Country code dropdown -->
  - phone (string) <!-- Frontend: Phone input with formatting -->
  - phoneCountryCode (string) <!-- Frontend: Country code dropdown -->
  - country (string) <!-- Frontend: Country dropdown -->
  - state (string) <!-- Frontend: State/province dropdown (dynamic based on country) -->
  - city (string) <!-- Frontend: Text input with autocomplete suggestions -->
  - street (string) <!-- Frontend: Text input -->
  - houseNo (string) <!-- Frontend: Text input -->
  - postalCode (string) <!-- Frontend: Postal code input with country-specific validation -->
  - emergencyContactName (string) <!-- Frontend: Text input -->
  - emergencyContactNumberCountryCode (string) <!-- Frontend: Country code dropdown -->
  - emergencyContactNumber (string) <!-- Frontend: Phone input with formatting -->
  - engagement (JSON array of objects) <!-- Frontend: Multi-select checkboxes or chips with custom UI -->
  - foodPreference (string) <!-- Frontend: Radio buttons or dropdown (Vegetarian, Vegan, etc.) -->
  - allergies (string[]) <!-- Frontend: Multi-select dropdown with common options + custom input -->
  - bahnCard (string) <!-- Frontend: Dropdown with BahnCard options (25, 50, 100, None) -->
  - schoolId (UUID, foreign key) <!-- Frontend: Searchable dropdown with schools -->
  - languages (string[]) <!-- Frontend: Multi-select dropdown with language options -->
  - socialSecurityNumber (string) <!-- Frontend: Masked input with country-specific format -->
  - iban (string) <!-- Frontend: IBAN input with formatting and validation -->
  - bic (string) <!-- Frontend: BIC input with validation -->
  - placeOfBirth (string) <!-- Frontend: Text input -->
  - hasDriverLicense (boolean, default: false) <!-- Frontend: Toggle/Switch -->
  - driverLicenseNumber (string) <!-- Frontend: Text input with conditional display (if hasDriverLicense is true) -->
  - driverLicenseClass (string) <!-- Frontend: Dropdown with license class options, conditional display -->

### 2. user_roles

- **Primary Key**: id (UUID)
- **Fields**:
  - user_id (UUID, foreign key to auth.users) <!-- Reference to Supabase auth user -->
  - role (string, enum: "user", "teamer", "admin") <!-- Frontend: Admin-only dropdown for role assignment -->
  - created_at (timestamp) <!-- Automatically managed by Supabase -->
  - updated_at (timestamp) <!-- Automatically managed by Supabase -->

### 3. events

- **Primary Key**: id (UUID)
- **Fields**:
  - nameDe (string) <!-- Frontend: Text input -->
  - nameEn (string) <!-- Frontend: Text input -->
  - locationDe (string) <!-- Frontend: Text input, potentially with location picker -->
  - locationEn (string) <!-- Frontend: Text input, potentially with location picker -->
  - startsAt (timestamp) <!-- Frontend: Date and time picker -->
  - endsAt (timestamp) <!-- Frontend: Date and time picker -->
  - deadline (timestamp) <!-- Frontend: Date and time picker -->
  - minAge (integer) <!-- Frontend: Number input with min/max constraints -->
  - statusInternal (string, default: "ACTIVE") <!-- Frontend: Dropdown with status options (ACTIVE, INACTIVE, etc.) -->
  - statusExternal (string, default: "ACTIVE") <!-- Frontend: Dropdown with status options (ACTIVE, INACTIVE, etc.) -->
  - shortcut (string) <!-- Frontend: Text input with validation -->
  - bahnCardRequired (boolean) <!-- Frontend: Toggle/Switch -->
  - languagesRequired (string[]) <!-- Frontend: Multi-select dropdown with language options -->
  - departureStationRequired (boolean) <!-- Frontend: Toggle/Switch -->
  - teamPreferenceOptions (JSON array of objects) <!-- Frontend: Dynamic form builder for team preference options -->
  - emergencyContactRequired (boolean) <!-- Frontend: Toggle/Switch -->
  - teamApplicationRequired (string, default: "NOT_OPEN") <!-- Frontend: Dropdown with options (NOT_OPEN, OPTIONAL, REQUIRED) -->
  - questions (JSON object) <!-- Frontend: Dynamic form builder for custom questions -->

### 4. applications

- **Primary Key**: id (UUID)
- **Fields**:
  - engagement (JSON array of objects) <!-- Frontend: Multi-select checkboxes or chips with custom UI -->
  - bahnCard (string) <!-- Frontend: Dropdown with BahnCard options (25, 50, 100, None) -->
  - departureStation (string) <!-- Frontend: Text input with station autocomplete -->
  - skills (JSON array of objects) <!-- Frontend: Multi-select with skill categories and levels -->
  - teamPreference (JSON array of objects) <!-- Frontend: Dynamic UI based on event's teamPreferenceOptions -->
  - recommendation (string) <!-- Frontend: Text area for longer text input -->
  - leadsource (string) <!-- Frontend: Dropdown with lead source options -->
  - status (string, default: "PENDING") <!-- Frontend: Dropdown or status pills (PENDING, APPROVED, REJECTED, etc.) -->
  - eventId (UUID, foreign key) <!-- Frontend: Hidden field or dropdown if selecting event -->
  - userId (UUID, foreign key) <!-- Frontend: Hidden field or user search for admins -->
  - answers (JSON object) <!-- Frontend: Dynamic form fields based on event's questions -->

### 5. schools

- **Primary Key**: id (UUID)
- **Fields**:
  - name (string) <!-- Frontend: Text input -->
  - state (string) <!-- Frontend: State/province dropdown -->
  - country (string) <!-- Frontend: Country dropdown -->
  - city (string) <!-- Frontend: Text input with autocomplete suggestions -->
  - street (string) <!-- Frontend: Text input -->
  - houseNo (string) <!-- Frontend: Text input -->
  - postalCode (string) <!-- Frontend: Postal code input with country-specific validation -->
  - isVerified (boolean, default: true) <!-- Frontend: Toggle/Switch for admins -->

## Role-Based Access Control

### User Roles

- **user**: Basic role for all authenticated users. Can view events and apply to them.
- **teamer**: Role for team members who support events. They have a different event application process and can enter more detailed profile information.
- **admin**: Administrative role. Can create/edit events, manage users, and access all admin features.

### Permissions by Role

1. **user**:

   - View public events
   - Apply to events
   - Manage own profile
   - View own applications

2. **teamer**:

   - All user permissions
   - Access different event application process
   - Enter more detailed profile information

3. **admin**:
   - All teamer permissions
   - Create, edit, and delete events
   - Access admin panel
   - Manage user accounts
   - Change user roles
   - View all applications

## Relationships

1. **profile** has many **applications**
2. **profile** belongs to one **school**
3. **events** has many **applications**
4. **auth.users** has one **user_roles** (optional)
