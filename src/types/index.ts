// Define the structure of a photo in our archive
export interface Photo {
  id: string;
  imageUrl: string;
  contributor: string;
  date: string;
  floorId: string;
  roomId?: string; // Optional room identifier if we want to highlight rooms on floor plans
  description?: string; // Optional description of the photo
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
}

export interface PhotoCardProps {
  photo: Photo;
}

export interface ContributeFormProps {
  onSubmit: (photo: Omit<Photo, 'id'>) => void;
  isOpen: boolean;
}
