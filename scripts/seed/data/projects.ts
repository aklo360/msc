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
  description?: string;
  body?: string;
  hidden?: boolean;
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
    body: '\u201CThe court we painted isn\u2019t just for the game, it\u2019s a love letter to Brooklyn, to the kids who dream beneath its skyline.\n\nEvery line, every color, every heart was drawn to remind them: you are seen, you are powerful, and this city beats for you.\u201D',
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
    folder: 'BBC',
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
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut at enim quis ante tristique fringilla vitae non turpis. Sed ac sagittis nibh. Nunc imperdiet neque pretium risus porttitor, nec congue massa rhoncus. Aliquam porttitor efficitur nunc at volutpat. Cras nisl orci, condimentum nec nibh et, viverra venenatis purus. Suspendisse massa est, convallis vel posuere sed, ullamcorper faucibus nibh. Quisque ut sollicitudin tellus. Aliquam eros volutpat. Sed elementum nisi non sapien malesuada, sed rhoncus dolor scelerisque. Etiam laoreet velit vel nibh blandit ullamcorper.',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at enim quis ante tristique fringilla vitae non turpis.',
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
    hidden: true,
  },
];
