import {createRoot} from 'react-dom/client';

import DarkRoomDeck from '../app/routes/dark-room-deck';

const el = document.getElementById('root');
if (el) createRoot(el).render(<DarkRoomDeck />);
