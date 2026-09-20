export interface Institution {
  id: string;
  name: string;
  email: string;
  type: string;
  placeId?: string;
  address?: string;
  createdAt: string;
}

export interface EcoHub {
  id: string;
  name: string;
  type: "School" | "Office" | "Residential" | "Park" | "University" | "Other";
  ownerId: string;
  placeId?: string;
  address?: string;
  createdAt: string;
}

export interface SubUnit {
  id: string;
  hubId: string;
  name: string;
  createdAt: string;
}

export interface EmissionRecord {
  id: string;
  hubId: string;
  unitId: string;
  weight: number;
  ch4: number;
  co2e: number;
  date: string;
  createdAt: string;
  canteenStand?: string;
  category?: string;
}
