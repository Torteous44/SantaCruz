import { Floor, Photo, AboutContent, Room } from '../types';

// Sample rooms data
const basementRooms: Room[] = [
  { id: 'basement-1', name: 'The Cave' },
  { id: 'basement-2', name: 'The Fab Lab' },
  { id: 'basement-3', name: 'Stairwell' },
  { id: 'basement-4', name: 'The Cave\'s Garden' },
];

const groundRooms: Room[] = [
  { id: 'ground-1', name: 'Main Cloister' },
  { id: 'ground-2', name: 'Aula Magna' },
  { id: 'ground-3', name: 'Design Studio' },
  { id: 'ground-4', name: 'Archaeology Room' },
  { id: 'ground-5', name: 'Stairwell' },
  { id: 'ground-6', name: 'Cloister Garden' },
];

const firstRooms: Room[] = [
  { id: 'first-1', name: 'Library' },
  { id: 'first-2', name: 'Main Hall' },
  { id: 'first-3', name: 'Classrooms' },
  { id: 'first-4', name: 'Stairwell' },
];

const secondRooms: Room[] = [
  { id: 'second-1', name: 'Fishtanks' },
  { id: 'second-2', name: 'Classrooms' },
  { id: 'second-3', name: 'Stairwell' },
];

const exteriorRooms: Room[] = [
  { id: 'exterior-1', name: 'Main Entrance' },
  { id: 'exterior-2', name: 'Cafeteria' },
  { id: 'exterior-3', name: 'Courtyard' },
  { id: 'exterior-4', name: 'Street View' },
  { id: 'exterior-5', name: 'The Hills View' },
];

// Define floors without sample photos
export const floors: Floor[] = [
  {
    id: 'basement',
    name: '-01',
    images: [],
    rooms: basementRooms,
  },
  {
    id: 'ground',
    name: '00',
    images: [],
    rooms: groundRooms,
  },
  {
    id: 'first',
    name: '01',
    images: [],
    rooms: firstRooms,
  },
  {
    id: 'second',
    name: '02',
    images: [],
    rooms: secondRooms,
  },
  {
    id: 'exterior',
    name: 'Exterior',
    images: [],
    rooms: exteriorRooms,
  },
];

// About content
export const aboutContent: AboutContent = {
  title: 'About the Santa Cruz Photographic Archive',
  paragraphs: [
    'The Convent of Santa Cruz la Real is a historic building with significant cultural value. This archive aims to document the building through photographs contributed by students, staff, alumni, and visitors.',
    'While professional photographs of the exterior are readily available, this project focuses on creating a comprehensive record of the interior spaces, capturing the unique character and history of the building.',
    'Users can tag their photos with the floor and room where the photograph was taken, and provide additional context about when it was captured.',
    'All content uploaded remains the property of the creator. By uploading images, you allow us to use them to create this crowdsourced photographic archive of the Santa Cruz building.',
  ],
};

// Add more sample data as needed
