export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  children: Child[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Child {
  name: string;
  age: number;
  dateOfBirth: Date;
}

export interface Playdate {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  organizer: User;
  location: Location;
  date: Date;
  startTime: string;
  endTime: string;
  participants: Participant[];
  maxParticipants?: number;
  ageRange: {
    min: number;
    max: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Participant {
  userId: string;
  user: User;
  childrenCount: number;
  joinedAt: Date;
}

export interface Location {
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export type TabParamList = {
  HomeTab: undefined;
  CreatePlaydate: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  PlaydateDetail: { playdateId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
