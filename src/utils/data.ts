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
    "This archive is dedicated to the Convent of Santa Cruz la Real in Segovia, Spain—a former Dominican monastery that now forms part of IE University's campus. This project captures the evolving character of this historic site through community contributions, preserving its unique atmosphere.",
  ],
};

// Add more sample data as needed
