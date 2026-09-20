# Security Specification - Emissioculator

## Data Invariants
1. A **User** must have a unique UID and a defined role (`owner` or `unit_admin`).
2. An **Institution** must be registered with a Google Place ID and is owned by a single `User Utama` (owner).
3. **Sub-Units** belong to a specific Institution and can only be managed by the Institution's owner.
4. **Emission Records** must be linked to both an Institution and a Unit. They must contain documentation proof (URL) as per new requirements.
5. **Access Requests** are the bridge between sub-unit admins and institutions. They must be approved by the Institution's owner before a `unit_admin` can log data.

## The "Dirty Dozen" Payloads (Denial Tests)

1. **Identity Spoofing**: User A attempts to create a profile for User B.
2. **Privilege Escalation**: A `unit_admin` attempts to change their own role to `owner`.
3. **Orphaned Unit**: Attempt to create a Unit for a non-existent Institution.
4. **Illegal Record Entry**: A user attempts to log data for an institution they are not part of (not owner, not approved admin).
5. **Unauthorized Approval**: User A attempts to approve an access request meant for User B's institution.
6. **Fake Documentation**: Attempt to save a record without a documentation URL.
7. **Institution Hijack**: A non-owner attempts to update an Institution's name or placeId.
8. **Resource Poisoning**: Injecting a 2MB string into the Institution's name field.
9. **State Shortcutting**: An access request is created with status `approved` directly by the requester.
10. **Data Scraping**: An unauthenticated user attempts to list all user emails.
11. **Unit Sabotage**: A `unit_admin` attempts to delete a Unit they didn't create (only owners should delete units).
12. **Timestamp Fraud**: Sending a `createdAt` value from the future.

## Test Runner (TDD)
I will implement `firestore.rules` to reject all these cases.
