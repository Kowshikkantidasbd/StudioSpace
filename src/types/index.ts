export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
}

export type StudioCategory =
  | 'Photo Studios'
  | 'Sound Stages'
  | 'Podcast Rooms'
  | 'Music Suites'
  | 'Art Workshops';

export interface Studio {
  id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
  location: string;
  address?: string;
  imageUrl: string;
  galleryImages: string[];
  amenities: string[];
  overview: string;
  dimensions?: string;
  powerSupply?: string;
  noiseIsolation?: string;
  rating: number;
  reviewCount: number;
  hostId: string;
  hostName: string;
  hostEmail: string;
  hostAvatar: string;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  hourlyRate: number;
  securityDeposit: number;
  subtotal: number;
  serviceFee: number;
  totalCost: number;
  specialRequests?: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  studioId: string;
  createdAt: string;
}
