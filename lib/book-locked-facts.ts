import type {
  BookCommonLockedFacts,
  BookDomesticSuspenseThrillerLockedFacts,
  BookLockedFacts,
  BookYaSuperheroOriginLockedFacts
} from "@/lib/story-schema";

export function createEmptyBookLockedFacts(): BookLockedFacts {
  return {
    common: createEmptyBookCommonLockedFacts(),
    profiles: {
      domestic_suspense_thriller: createEmptyDomesticSuspenseThrillerLockedFacts(),
      ya_superhero_origin: createEmptyYaSuperheroOriginLockedFacts()
    }
  };
}

export function createEmptyBookCommonLockedFacts(): BookCommonLockedFacts {
  return {
    protagonistNames: [],
    antagonistNames: [],
    institutionNames: [],
    keyObjectNames: [],
    fixedLocations: [],
    fixedDates: []
  };
}

export function createEmptyDomesticSuspenseThrillerLockedFacts(): BookDomesticSuspenseThrillerLockedFacts {
  return {
    childName: null,
    coparentName: null,
    institutionName: null,
    incidentDate: null,
    incidentTime: null,
    notificationTime: null,
    firstOfficeTime: null,
    documentedPickupPerson: null,
    alibiLocation: null,
    alibiWindow: null
  };
}

export function createEmptyYaSuperheroOriginLockedFacts(): BookYaSuperheroOriginLockedFacts {
  return {
    teamMemberNames: [],
    substanceName: null,
    aiCompanionName: null,
    experimentLocation: null,
    organizationName: null,
    triggerEvent: null,
    accidentMechanism: null,
    powerOrigin: null
  };
}

export function normalizeBookLockedFacts(value: unknown): BookLockedFacts {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const profileRecord =
    record.profiles && typeof record.profiles === "object"
      ? (record.profiles as Record<string, unknown>)
      : {};
  const legacy = normalizeLegacyBookLockedFacts(record);
  const common = normalizeBookCommonLockedFacts(record.common);
  const domestic = normalizeDomesticSuspenseThrillerLockedFacts(
    profileRecord.domestic_suspense_thriller
  );
  const yaSuperhero = normalizeYaSuperheroOriginLockedFacts(profileRecord.ya_superhero_origin);

  return {
    common: {
      protagonistNames: uniqueLockedFactStrings(
        common.protagonistNames.concat(legacy.common.protagonistNames)
      ),
      antagonistNames: uniqueLockedFactStrings(
        common.antagonistNames.concat(legacy.common.antagonistNames)
      ),
      institutionNames: uniqueLockedFactStrings(
        common.institutionNames.concat(legacy.common.institutionNames)
      ),
      keyObjectNames: uniqueLockedFactStrings(common.keyObjectNames),
      fixedLocations: uniqueLockedFactStrings(
        common.fixedLocations.concat(legacy.common.fixedLocations)
      ),
      fixedDates: uniqueLockedFactStrings(common.fixedDates.concat(legacy.common.fixedDates))
    },
    profiles: {
      domestic_suspense_thriller: mergeDomesticSuspenseThrillerLockedFacts(
        legacy.profiles.domestic_suspense_thriller,
        domestic
      ),
      ya_superhero_origin: yaSuperhero
    }
  };
}

export function mergeBookLockedFacts(existing: BookLockedFacts, incoming: BookLockedFacts): BookLockedFacts {
  const existingDomestic = getDomesticSuspenseLockedFacts(existing);
  const incomingDomestic = getDomesticSuspenseLockedFacts(incoming);
  const existingYa = getYaSuperheroLockedFacts(existing);
  const incomingYa = getYaSuperheroLockedFacts(incoming);

  return {
    common: {
      protagonistNames: uniqueLockedFactStrings(existing.common.protagonistNames.concat(incoming.common.protagonistNames)),
      antagonistNames: uniqueLockedFactStrings(existing.common.antagonistNames.concat(incoming.common.antagonistNames)),
      institutionNames: uniqueLockedFactStrings(existing.common.institutionNames.concat(incoming.common.institutionNames)),
      keyObjectNames: uniqueLockedFactStrings(existing.common.keyObjectNames.concat(incoming.common.keyObjectNames)),
      fixedLocations: uniqueLockedFactStrings(existing.common.fixedLocations.concat(incoming.common.fixedLocations)),
      fixedDates: uniqueLockedFactStrings(existing.common.fixedDates.concat(incoming.common.fixedDates))
    },
    profiles: {
      domestic_suspense_thriller: mergeDomesticSuspenseThrillerLockedFacts(
        existingDomestic,
        incomingDomestic
      ),
      ya_superhero_origin: {
        teamMemberNames: uniqueLockedFactStrings(existingYa.teamMemberNames.concat(incomingYa.teamMemberNames)),
        substanceName: incomingYa.substanceName || existingYa.substanceName,
        aiCompanionName: incomingYa.aiCompanionName || existingYa.aiCompanionName,
        experimentLocation: incomingYa.experimentLocation || existingYa.experimentLocation,
        organizationName: incomingYa.organizationName || existingYa.organizationName,
        triggerEvent: incomingYa.triggerEvent || existingYa.triggerEvent,
        accidentMechanism: incomingYa.accidentMechanism || existingYa.accidentMechanism,
        powerOrigin: incomingYa.powerOrigin || existingYa.powerOrigin
      }
    }
  };
}

export function getCommonLockedFacts(lockedFacts: BookLockedFacts): BookCommonLockedFacts {
  return lockedFacts.common;
}

export function getDomesticSuspenseLockedFacts(
  lockedFacts: BookLockedFacts
): BookDomesticSuspenseThrillerLockedFacts {
  return lockedFacts.profiles.domestic_suspense_thriller;
}

export function getYaSuperheroLockedFacts(
  lockedFacts: BookLockedFacts
): BookYaSuperheroOriginLockedFacts {
  return lockedFacts.profiles.ya_superhero_origin;
}

export function hasDomesticSuspenseLockedFacts(lockedFacts: BookLockedFacts) {
  const domestic = getDomesticSuspenseLockedFacts(lockedFacts);
  return Boolean(
    domestic.childName ||
    domestic.coparentName ||
    domestic.institutionName ||
    domestic.incidentDate ||
    domestic.incidentTime ||
    domestic.notificationTime ||
    domestic.firstOfficeTime ||
    domestic.documentedPickupPerson ||
    domestic.alibiLocation ||
    domestic.alibiWindow
  );
}

export function hasBookLockedFacts(lockedFacts: BookLockedFacts) {
  const common = getCommonLockedFacts(lockedFacts);
  const yaSuperhero = getYaSuperheroLockedFacts(lockedFacts);

  return Boolean(
    common.protagonistNames.length ||
    common.antagonistNames.length ||
    common.institutionNames.length ||
    common.keyObjectNames.length ||
    common.fixedLocations.length ||
    common.fixedDates.length ||
    hasDomesticSuspenseLockedFacts(lockedFacts) ||
    yaSuperhero.teamMemberNames.length ||
    yaSuperhero.substanceName ||
    yaSuperhero.aiCompanionName ||
    yaSuperhero.experimentLocation ||
    yaSuperhero.organizationName ||
    yaSuperhero.triggerEvent ||
    yaSuperhero.accidentMechanism ||
    yaSuperhero.powerOrigin
  );
}

function normalizeBookCommonLockedFacts(value: unknown): BookCommonLockedFacts {
  const record = value && typeof value === "object" ? (value as Partial<BookCommonLockedFacts>) : null;

  return {
    protagonistNames: normalizeLockedFactStringArray(record?.protagonistNames),
    antagonistNames: normalizeLockedFactStringArray(record?.antagonistNames),
    institutionNames: normalizeLockedFactStringArray(record?.institutionNames),
    keyObjectNames: normalizeLockedFactStringArray(record?.keyObjectNames),
    fixedLocations: normalizeLockedFactStringArray(record?.fixedLocations),
    fixedDates: normalizeLockedFactStringArray(record?.fixedDates)
  };
}

function normalizeDomesticSuspenseThrillerLockedFacts(
  value: unknown
): BookDomesticSuspenseThrillerLockedFacts {
  const record =
    value && typeof value === "object"
      ? (value as Partial<BookDomesticSuspenseThrillerLockedFacts> & {
          evaAlibiLocation?: unknown;
          evaAlibiWindow?: unknown;
        })
      : null;

  return {
    childName: normalizeNullableLockedFactString(record?.childName),
    coparentName: normalizeNullableLockedFactString(record?.coparentName),
    institutionName: normalizeNullableLockedFactString(record?.institutionName),
    incidentDate: normalizeNullableLockedFactString(record?.incidentDate),
    incidentTime: normalizeNullableLockedFactString(record?.incidentTime),
    notificationTime: normalizeNullableLockedFactString(record?.notificationTime),
    firstOfficeTime: normalizeNullableLockedFactString(record?.firstOfficeTime),
    documentedPickupPerson: normalizeNullableLockedFactString(record?.documentedPickupPerson),
    alibiLocation:
      normalizeNullableLockedFactString(record?.alibiLocation) ||
      normalizeNullableLockedFactString(record?.evaAlibiLocation),
    alibiWindow:
      normalizeNullableLockedFactString(record?.alibiWindow) ||
      normalizeNullableLockedFactString(record?.evaAlibiWindow)
  };
}

function normalizeYaSuperheroOriginLockedFacts(value: unknown): BookYaSuperheroOriginLockedFacts {
  const record =
    value && typeof value === "object" ? (value as Partial<BookYaSuperheroOriginLockedFacts>) : null;

  return {
    teamMemberNames: normalizeLockedFactStringArray(record?.teamMemberNames),
    substanceName: normalizeNullableLockedFactString(record?.substanceName),
    aiCompanionName: normalizeNullableLockedFactString(record?.aiCompanionName),
    experimentLocation: normalizeNullableLockedFactString(record?.experimentLocation),
    organizationName: normalizeNullableLockedFactString(record?.organizationName),
    triggerEvent: normalizeNullableLockedFactString(record?.triggerEvent),
    accidentMechanism: normalizeNullableLockedFactString(record?.accidentMechanism),
    powerOrigin: normalizeNullableLockedFactString(record?.powerOrigin)
  };
}

function normalizeLegacyBookLockedFacts(record: Record<string, unknown>): BookLockedFacts {
  const lockedFacts = createEmptyBookLockedFacts();
  const protagonistName = normalizeNullableLockedFactString(record.protagonistName);
  const antagonistName = normalizeNullableLockedFactString(record.antagonistName);
  const institutionName = normalizeNullableLockedFactString(record.institutionName);
  const alibiLocation = normalizeNullableLockedFactString(record.evaAlibiLocation);
  const incidentDate = normalizeNullableLockedFactString(record.incidentDate);

  lockedFacts.common.protagonistNames = protagonistName ? [protagonistName] : [];
  lockedFacts.common.antagonistNames = antagonistName ? [antagonistName] : [];
  lockedFacts.common.institutionNames = institutionName ? [institutionName] : [];
  lockedFacts.common.fixedLocations = alibiLocation ? [alibiLocation] : [];
  lockedFacts.common.fixedDates = incidentDate ? [incidentDate] : [];
  lockedFacts.profiles.domestic_suspense_thriller = {
    childName: normalizeNullableLockedFactString(record.childName),
    coparentName: normalizeNullableLockedFactString(record.coparentName),
    institutionName,
    incidentDate,
    incidentTime: normalizeNullableLockedFactString(record.incidentTime),
    notificationTime: normalizeNullableLockedFactString(record.notificationTime),
    firstOfficeTime: normalizeNullableLockedFactString(record.firstOfficeTime),
    documentedPickupPerson: normalizeNullableLockedFactString(record.documentedPickupPerson),
    alibiLocation,
    alibiWindow: normalizeNullableLockedFactString(record.evaAlibiWindow)
  };

  return lockedFacts;
}

function mergeDomesticSuspenseThrillerLockedFacts(
  fallback: BookDomesticSuspenseThrillerLockedFacts,
  incoming: BookDomesticSuspenseThrillerLockedFacts
): BookDomesticSuspenseThrillerLockedFacts {
  return {
    childName: incoming.childName || fallback.childName,
    coparentName: incoming.coparentName || fallback.coparentName,
    institutionName: incoming.institutionName || fallback.institutionName,
    incidentDate: incoming.incidentDate || fallback.incidentDate,
    incidentTime: incoming.incidentTime || fallback.incidentTime,
    notificationTime: incoming.notificationTime || fallback.notificationTime,
    firstOfficeTime: incoming.firstOfficeTime || fallback.firstOfficeTime,
    documentedPickupPerson: incoming.documentedPickupPerson || fallback.documentedPickupPerson,
    alibiLocation: incoming.alibiLocation || fallback.alibiLocation,
    alibiWindow: incoming.alibiWindow || fallback.alibiWindow
  };
}

function normalizeNullableLockedFactString(value: unknown) {
  return typeof value === "string" ? value.trim() || null : null;
}

function normalizeLockedFactStringArray(value: unknown) {
  return Array.isArray(value)
    ? uniqueLockedFactStrings(value.filter(function (entry): entry is string {
        return typeof entry === "string";
      }))
    : [];
}

function uniqueLockedFactStrings(values: string[]) {
  return Array.from(new Set(values.map(function (value) {
    return value.trim();
  }).filter(Boolean)));
}
