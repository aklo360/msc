export interface ProjectData {
  title: string;
  category: string;
  collaborator: string;
  location: string;
  year: string;
  seriesTag: string;
  handle: string;
  links: {label: string; url: string}[];
  inquiryEmail?: string;
  folder: string;
}

export const PROJECTS: ProjectData[] = [
  {
    title: 'King of Hearts Basketball Court',
    category: 'Public Art Installation',
    collaborator: 'NYC Parks',
    location: 'Brooklyn, NY',
    year: '2024',
    seriesTag: 'Loverboy Series',
    handle: 'king-of-hearts-basketball-court',
    links: [
      {
        label: 'NYC Parks \u2014 Art in the Parks',
        url: 'https://www.nycgovparks.org/art-and-antiquities/public-art/the-royal-court-loverboy-king-of-hearts',
      },
      {
        label: 'stupidDOPE',
        url: 'https://stupiddope.com/2025/11/david-mr-starcity-white-the-royal-court-brooklyn-mural/',
      },
    ],
    folder: 'King of Hearts Basketball Court',
  },
  {
    title: 'Loverboy x Billionaire Boys Club',
    category: 'Fashion Collaboration',
    collaborator: 'Pharrell Williams / BBC',
    location: '',
    year: '2024',
    seriesTag: 'Loverboy Series',
    handle: 'loverboy-x-billionaire-boys-club',
    links: [
      {
        label: 'Hypebeast \u2014 BBC x Mr.StarCity',
        url: 'https://hypebeast.com/2024/2/pharrell-billionaire-boys-club-black-history-month-mrstarcity-exclusive-collaboration',
      },
      {
        label: 'BBC Official',
        url: 'https://www.bbcicecream.com/collections/billionaire-boys-club-x-mr-starcity-x-league-oto',
      },
    ],
    folder: '',
  },
  {
    title: 'Loverboy x SLR Pendant',
    category: 'Jewelry Collaboration',
    collaborator: 'SLR',
    location: '',
    year: '2023',
    seriesTag: 'Loverboy Series',
    handle: 'loverboy-x-slr-pendant',
    links: [
      {
        label: 'View Photos',
        url: 'https://www.dropbox.com/scl/fo/a9mwqb52lgjnbncojf859/APcZDl3YcVmDI6Kn4brRiwY?rlkey=7nfu58tigzyoqyflbgoeg7qmm&st=a077cdvj&dl=0',
      },
    ],
    inquiryEmail: 'mrstarcity@gmail.com',
    folder: 'SLR x Mr.StarCity Jewelry Collab',
  },
  {
    title: 'Avant Arte',
    category: 'Print Edition',
    collaborator: 'Avant Arte',
    location: '',
    year: '2023',
    seriesTag: 'Loverboy Series',
    handle: 'avant-arte',
    links: [],
    folder: '2023_Avant Arte',
  },
  {
    title: 'The Fat Boys: Each One Teach One',
    category: 'Art Direction',
    collaborator: '',
    location: '',
    year: '2025',
    seriesTag: '',
    handle: 'the-fat-boys-each-one-teach-one',
    links: [],
    folder: '2025_The Fat Boys Each One Teach One',
  },
];
