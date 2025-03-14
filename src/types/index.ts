// Define the structure of a photo in our archive
export interface Photo {
  id: string;
  _id?: string; // MongoDB ID from the server
  imageUrl: string;
  contributor?: string;
  date?: string;
  floorId: string;
  roomId?: string; // Optional room identifier if we want to highlight rooms on floor plans
  description?: string; // Optional description of the photo
  caption?: string; // Alternative to description for display purposes
  status?: 'pending' | 'approved' | 'rejected'; // For admin functionality
  approvedAt?: string; // Timestamp when photo was approved
  submittedAt?: string; // Timestamp when photo was submitted
  cloudflareId?: string; // Cloudflare image ID
  originalFileName?: string; // Original uploaded filename
}

// Define a room in a floor
export interface Room {
  id: string;
  name: string;
  description?: string;
}

// Define the structure of a floor in our building
export interface Floor {
  id: string;
  name: string;
  floorPlanUrl?: string; // Made optional since we're not using floor plan images anymore
  images: Photo[];
  rooms?: Room[]; // Add rooms to each floor
}

// Define the structure for our about section content
export interface AboutContent {
  title: string;
  paragraphs: string[];
}

// Define props for our components
export interface NavBarProps {
  isAboutOpen: boolean;
  toggleAbout: () => void;
  isContributeOpen: boolean;
  toggleContribute: () => void;
  floors?: Floor[];
}

export interface AboutSectionProps {
  isOpen: boolean;
  content: AboutContent;
}

export interface FloorColumnProps {
  floor: Floor;
  expandedImageId?: string | null;
  onImageExpand?: (photoId: string, floorId: string) => void;
}

export interface PhotoCardProps {
  photo: Photo;
  isExpanded?: boolean;
  onExpand?: () => void;
  floor?: Floor;
}

export interface ContributeFormProps {
  onSubmit: (photo: Omit<Photo, 'id'>) => void;
  isOpen: boolean;
  floors?: Floor[];
}

export interface MobileViewProps {
  floors: Floor[];
  expandedFloor: string | null;
  toggleFloorExpansion: (floorId: string) => void;
  isAboutOpen: boolean;
  toggleAbout: () => void;
  isContributeOpen: boolean;
  toggleContribute: () => void;
}
