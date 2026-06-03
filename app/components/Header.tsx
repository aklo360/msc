import {useState, useEffect} from 'react';
import {NavLink, useLocation} from 'react-router';

const NAV_ITEMS = [
  {label: 'ART', to: '/art', color: '#FF9E70'},
  {label: 'MUSIC', to: '/music', color: '#FFD770'},
  {label: 'PROJECTS', to: '/projects', color: '#92D073'},
  {label: 'MSC SHOP', to: '/shop', color: '#73B9D0'},
  {label: 'EDITORIAL', to: '/editorial', color: '#F46060'},
  {label: 'BIG BLESS', to: '/big-bless', color: '#D073A5'},
];

function SearchIcon() {
  return (
    <svg width="35" height="35" viewBox="0 0 45.5015 37" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.7528 25.8481C26.9406 25.8481 30.3355 22.453 30.3355 18.2651C30.3355 14.0771 26.9406 10.6821 22.7528 10.6821C18.5649 10.6821 15.17 14.0771 15.17 18.2651C15.17 22.453 18.5649 25.8481 22.7528 25.8481Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M39.7864 17.0748C30.0503 8.55204 15.4502 8.55204 5.71412 17.0748C4.99638 17.7048 4.99638 18.8279 5.71412 19.4579C15.4502 27.9807 30.0503 27.9807 39.7864 19.4579C40.5041 18.8279 40.5041 17.7048 39.7864 17.0748Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.752 1V6.16377" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.3086 1.68164L16.6486 6.68017" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.86331 4.26349L10.7085 8.64753" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.00003 8.31708L5.12061 11.658" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30.1935 1.68164L28.8535 6.68017" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M37.6382 4.26349L34.793 8.64753" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M44.5015 8.31708L40.3809 11.658" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.752 36V30.8362" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.3086 35.3209L16.6486 30.3198" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.86331 32.7365L10.7085 28.3525" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.00003 28.683L5.12061 25.342" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30.1935 35.3209L28.8535 30.3198" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M37.6382 32.7365L34.793 28.3525" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M44.5015 28.683L40.3809 25.342" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="35" height="35" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.5 36C28.165 36 36 28.165 36 18.5C36 8.83502 28.165 1 18.5 1C8.83502 1 1 8.83502 1 18.5C1 28.165 8.83502 36 18.5 36Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.07031 12.0024L15.0733 10.9242L17.2411 20.0657L20.8455 9.75146H28.3754" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.66955 22.8327C11.269 22.8327 12.5657 21.3884 12.5657 19.6068C12.5657 17.8252 11.269 16.3809 9.66955 16.3809C8.07007 16.3809 6.77344 17.8252 6.77344 19.6068C6.77344 21.3884 8.07007 22.8327 9.66955 22.8327Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26.294 21.7602C28.1057 21.7602 29.5744 20.1041 29.5744 18.0612C29.5744 16.0183 28.1057 14.3622 26.294 14.3622C24.4823 14.3622 23.0137 16.0183 23.0137 18.0612C23.0137 20.1041 24.4823 21.7602 26.294 21.7602Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.1731 30.8042C19.9492 30.8042 22.1997 29.5717 22.1997 28.0515C22.1997 26.5312 19.9492 25.2987 17.1731 25.2987C14.397 25.2987 12.1465 26.5312 12.1465 28.0515C12.1465 29.5717 14.397 30.8042 17.1731 30.8042Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="35" height="35" viewBox="0 0 39.9582 37" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.19737 12.3984L7.33656 12.4331C5.46507 12.4678 3.93264 13.0925 2.73926 14.3046C1.54589 15.5167 0.969223 17.0331 1.00126 18.8565C1.03864 20.8294 1.68738 22.3619 2.9475 23.4511C4.20762 24.5404 5.87621 25.0663 7.9506 25.0289L8.51925 25.0183C8.6207 25.0183 8.7088 25.0022 8.78356 24.9755L9.42696 24.9248C8.12146 26.823 7.48072 28.5183 7.51009 30.0107C7.53145 31.1747 7.94526 32.28 8.74885 33.3292C9.50172 34.3276 10.4762 35.0565 11.6749 35.5157C12.5159 35.8547 13.3542 36.0149 14.1898 35.9989C16.7447 35.9509 18.6669 34.4478 19.9538 31.487L20.21 30.9131C21.7905 34.1995 23.8703 35.8174 26.4519 35.7693C28.1979 35.7373 29.717 35.0992 31.0118 33.8604C32.304 32.6217 32.9367 31.1667 32.9047 29.4954C32.8753 27.9763 32.304 26.4813 31.188 25.0103L30.7982 24.5244C31.3055 24.5644 31.9142 24.5804 32.6217 24.5671C34.5199 24.5324 36.0576 23.9076 37.2377 22.6956C38.4177 21.4835 38.989 19.9671 38.957 18.1437C38.9196 16.144 38.2628 14.6063 36.992 13.5304C35.7186 12.4518 34.0687 11.9339 32.045 11.9712L30.566 11.9979C31.8715 10.0997 32.5122 8.41781 32.4829 6.94945C32.4508 5.30489 31.762 3.8926 30.4111 2.71791C29.0602 1.54323 27.5251 0.969234 25.8032 1.00127C23.2215 1.04933 21.2886 2.55506 20.0018 5.5158L19.7455 6.0898C18.165 2.80335 16.096 1.18281 13.541 1.23087C11.8965 1.26291 10.4014 1.88495 9.05854 3.09969C7.71566 4.31442 7.0589 5.76409 7.09094 7.44603C7.12298 9.12796 7.68095 10.6043 8.76754 11.8751L9.1947 12.3984H9.19737Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M19.9826 23.7254C22.8843 23.7254 25.2366 21.3731 25.2366 18.4713C25.2366 15.5696 22.8843 13.2173 19.9826 13.2173C17.0808 13.2173 14.7285 15.5696 14.7285 18.4713C14.7285 21.3731 17.0808 23.7254 19.9826 23.7254Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="5" y1="10" x2="30" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="17.5" x2="30" y2="17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="25" x2="30" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="8" y1="8" x2="27" y2="27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="27" y1="8" x2="8" y2="27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);
  const [hoveredIconIndex, setHoveredIconIndex] = useState<number | null>(null);
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);
  const isHomePage = location.pathname === '/';
  const hidePageNav = isHomePage;
  // Hero pages (home, every section landing, and individual art pages) overlay
  // their hero so the transparent nav shows the hero/artwork behind it instead
  // of a solid strip of page background.
  const HERO_ROUTES = [
    '/',
    '/art',
    '/music',
    '/projects',
    '/shop',
    '/editorial',
    '/big-bless',
  ];
  const overlayNav =
    HERO_ROUTES.includes(location.pathname) ||
    location.pathname.startsWith('/art/');

  // Headroom behavior: the nav follows the scroll, but slides up off-screen
  // when scrolling down and slides back down when scrolling up. Always shown
  // near the very top, and never hidden while the mobile menu is open.
  const [navHidden, setNavHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      if (y < 80) {
        setNavHidden(false);
      } else if (y > lastY + 4) {
        setNavHidden(true);
      } else if (y < lastY - 4) {
        setNavHidden(false);
      }
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const navHiddenNow = navHidden && !mobileMenuOpen;

  return (
    <header
      className={`${overlayNav ? 'fixed' : 'sticky'} top-0 z-50 w-full`}
      style={{
        transform: navHiddenNow ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.35s ease',
      }}
    >
      <div
        className="h-[10vh]"
        style={{
          // Transparent over the hero. On mobile the bar turns opaque (hero
          // accent) the instant the hamburger menu opens — no fade — so the
          // expanded menu reads as a solid block; closed stays see-through.
          backgroundColor: mobileMenuOpen
            ? 'var(--active-accent, var(--color-accent-art))'
            : 'transparent',
        }}
      >
        {/* Desktop nav */}
        <div className="hidden lg:flex items-center w-full h-full px-[60px]">
          {/* Logo */}
          <NavLink to="/" className="shrink-0" aria-label="MSC Home">
            <div className="flex text-[var(--color-black)]" onMouseLeave={() => setHoveredLetter(null)} style={{height: 46, aspectRatio: '418.6 / 89.6'}}>
              {/* M — viewBox absorbs half-gap (4u) on right */}
              <svg
                viewBox="0 0 151 89.6"
                preserveAspectRatio="none"
                fill="currentColor"
                onMouseEnter={() => setHoveredLetter('M')}
                style={{
                  flexGrow: hoveredLetter === 'M' ? 83 : 151,
                  flexShrink: 0,
                  flexBasis: 0,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'flex-grow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <path d="M70.3,35.1h75c.5,0,1,.2,1.3.6.4.4.6.8.6,1.3v50.7c0,.5-.2,1-.6,1.3s-.8.6-1.3.6h-45.6c-.5,0-1-.2-1.3-.6s-.6-.8-.6-1.3v-20.6c0-.6-.3-1-.9-1.2-.6-.2-1.1,0-1.4.4l-14.3,22c-.2.3-.5.6-1,.9-.5.3-.9.4-1.3.4h-10.4c-.4,0-.9-.1-1.3-.4-.5-.3-.8-.6-1-.9l-14.1-22c-.3-.5-.8-.7-1.4-.4-.6.2-.9.6-.9,1.2v20.6c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6H1.9c-.5,0-1-.2-1.3-.6s-.6-.8-.6-1.3v-50.7c0-.5.2-1,.6-1.3.4-.4.8-.6,1.3-.6h68.4Z" />
                <path d="M53.2,1.9l14.5,23.2c.3.5.4,1,.1,1.5-.3.5-.6.8-1.2.8H1.9c-.5,0-1-.2-1.3-.6-.4-.4-.6-.8-.6-1.3V1.9c0-.5.2-1,.6-1.3.4-.4.8-.6,1.3-.6h48.1c1.5,0,2.5.6,3.2,1.9Z" />
                <path d="M146.6.6c.4.4.6.8.6,1.3v23.6c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-65c-.5,0-.9-.3-1.2-.8-.3-.5-.2-1,.1-1.5L93.6,1.9c.7-1.3,1.7-1.9,3.2-1.9h48.5c.5,0,1,.2,1.3.6Z" />
              </svg>
              {/* S — viewBox absorbs half-gap (4u) on each side */}
              <svg
                viewBox="151 0 136 89.6"
                preserveAspectRatio="none"
                fill="currentColor"
                onMouseEnter={() => setHoveredLetter('S')}
                style={{
                  flexGrow: hoveredLetter === 'S' ? 75 : 136,
                  flexShrink: 0,
                  flexBasis: 0,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'flex-grow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <path d="M276.7,83.4c-4.1,4.1-10.6,6.2-19.4,6.2h-76.8c-8.8,0-15.3-2.1-19.4-6.2-4.1-4.1-6.2-10.5-6.2-19.1c.1,-.7,.6,-1.9,1.9,-1.9h47.4c.5,0,1,.2,1.3.6s.6.8.6,1.3v4.9c0,4.2,1.1,7.4,3.3,9.5s5.4,3.3,9.5,3.3,7.4-1.1,9.5-3.3c2.2-2.2,3.3-5.4,3.3-9.5v-.4c0-4.3-.6-7.3-1.7-9.2-1.2-1.9-3.4-3.1-6.8-3.8-3.4-.6-8.9-1-16.7-1-12.5,0-22.4-.6-29.9-1.8-7.5-1.2-12.9-3.1-16.4-5.6-3.5-2.6-5.2-6-5.2-10.4s.2-1,.5-1.3c.3-.4.8-.6,1.3-.6h74.9c12.9,0,23,.9,30.4,2.7,7.4,1.8,12.7,4.7,15.9,8.6,3.2,4,4.9,9.4,4.9,16.3v1.3c0,8.8-2.1,15.3-6.2,19.4Z" />
                <path d="M155.5,26.8c-.4-.4-.6-.8-.6-1.3v-.6c0-8.8,2-15.1,6.1-19,4.1-3.9,10.6-5.8,19.5-5.8h76.8c8.9,0,15.4,1.9,19.5,5.8,4.1,3.9,6.1,10.2,6.1,19v.6c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-47.4c-.5,0-1-.2-1.3-.6-.4-.4-.6-.8-.6-1.3v-5c0-4.2-1.1-7.4-3.3-9.5-2.2-2.2-5.4-3.3-9.5-3.3s-7.4,1.1-9.5,3.3c-2.2,2.2-3.3,5.4-3.3,9.5v5c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-47.4c-.5,0-1-.2-1.3-.6Z" />
              </svg>
              {/* C — viewBox absorbs half-gap (4u) on left */}
              <svg
                viewBox="287 0 131.6 89.6"
                preserveAspectRatio="none"
                fill="currentColor"
                onMouseEnter={() => setHoveredLetter('C')}
                style={{
                  flexGrow: hoveredLetter === 'C' ? 72 : 131.6,
                  flexShrink: 0,
                  flexBasis: 0,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'flex-grow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <path d="M341.2,35.6c.4.4.6.8.6,1.3v32.3c0,4.2,1.1,7.4,3.3,9.5s5.4,3.3,9.5,3.3,7.4-1.1,9.5-3.3c2.2-2.2,3.3-5.4,3.3-9.5v-12.7c0-.5.2-1,.6-1.3.4-.4.8-.6,1.3-.6h47.4c.5,0,1,.2,1.3.6.4.4.6.8.6,1.3v7.4c0,8.3-2.2,14.6-6.5,19-4.4,4.4-10.7,6.6-19.1,6.6h-76.8c-8.3,0-14.6-2.2-19-6.6-4.4-4.4-6.6-10.7-6.6-19v-27c0-.5.2-1,.6-1.3.4-.4.8-.6,1.3-.6h47.4c.5,0,1,.2,1.3.6Z" />
                <path d="M291.1,26.8c-.4-.4-.6-.8-.6-1.3v-1c0-8.2,2.2-14.3,6.5-18.4,4.3-4.1,10.7-6.1,19.1-6.1h76.8c8.4,0,14.8,2,19.1,6.1,4.3,4.1,6.5,10.2,6.5,18.4v1c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-47.4c-.5,0-1-.2-1.3-.6-.4-.4-.6-.8-.6-1.3v-5c0-4.2-1.1-7.4-3.3-9.5-2.2-2.2-5.4-3.3-9.5-3.3s-7.4,1.1-9.5,3.3c-2.2,2.2-3.3,5.4-3.3,9.5v5c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-47.4c-.5,0-1-.2-1.3-.6Z" />
              </svg>
            </div>
          </NavLink>

          {/* Nav links */}
          {!hidePageNav && (
            <nav className="flex items-center gap-6 ml-auto mr-8">
              {NAV_ITEMS.map((item, i) => {
                const isHovered = hoveredNavIndex === i;
                const hasHover = hoveredNavIndex !== null;
                const scale = hasHover ? (isHovered ? 1.15 : 0.95) : 1;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    prefetch="intent"
                    className="cursor-pointer uppercase"
                    onMouseEnter={() => setHoveredNavIndex(i)}
                    onMouseLeave={() => setHoveredNavIndex(null)}
                    style={({isActive}) => ({
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-nav)',
                      fontWeight: isActive ? 800 : 500,
                      fontFeatureSettings: "'salt' 1",
                      color: 'var(--color-black)',
                      textDecoration: 'none',
                      transform: `scale(${scale})`,
                      transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    })}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          )}

          {/* Icon buttons */}
          <div className={`flex items-center gap-[10px] ${hidePageNav ? 'ml-auto' : ''}`}>
            {[
              {href: '/search', icon: <SearchIcon />, label: 'SEARCH'},
              {href: '/account', icon: <ProfileIcon />, label: 'PROFILE'},
              {href: '/cart', icon: <CartIcon />, label: 'CART'},
            ].map((item, i) => {
              const isHovered = hoveredIconIndex === i;
              const hasHover = hoveredIconIndex !== null;
              const scale = hasHover ? (isHovered ? 1.15 : 0.95) : 1;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="cursor-pointer text-[var(--color-black)] relative"
                  onMouseEnter={() => setHoveredIconIndex(i)}
                  onMouseLeave={() => setHoveredIconIndex(null)}
                  style={{
                    transform: `scale(${scale})`,
                    transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  {item.icon}
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      fontWeight: 500,
                      fontFeatureSettings: "'salt' 1",
                      letterSpacing: '0.05em',
                      color: 'var(--color-black)',
                      pointerEvents: 'none',
                      position: 'absolute',
                      left: '50%',
                      top: '100%',
                      transform: 'translateX(-50%)',
                      marginTop: '4px',
                      whiteSpace: 'nowrap',
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Mobile nav bar */}
        <div className="flex lg:hidden items-center justify-between w-full h-full px-[var(--padding-x-mobile)]">
          <NavLink to="/" className="shrink-0" aria-label="MSC Home">
            <svg viewBox="0 0 418.6 89.6" fill="currentColor" className="h-[29px] w-auto block text-[var(--color-black)]">
              <path d="M70.3,35.1h75c.5,0,1,.2,1.3.6.4.4.6.8.6,1.3v50.7c0,.5-.2,1-.6,1.3s-.8.6-1.3.6h-45.6c-.5,0-1-.2-1.3-.6s-.6-.8-.6-1.3v-20.6c0-.6-.3-1-.9-1.2-.6-.2-1.1,0-1.4.4l-14.3,22c-.2.3-.5.6-1,.9-.5.3-.9.4-1.3.4h-10.4c-.4,0-.9-.1-1.3-.4-.5-.3-.8-.6-1-.9l-14.1-22c-.3-.5-.8-.7-1.4-.4-.6.2-.9.6-.9,1.2v20.6c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6H1.9c-.5,0-1-.2-1.3-.6s-.6-.8-.6-1.3v-50.7c0-.5.2-1,.6-1.3.4-.4.8-.6,1.3-.6h68.4Z" />
              <path d="M276.7,83.4c-4.1,4.1-10.6,6.2-19.4,6.2h-76.8c-8.8,0-15.3-2.1-19.4-6.2-4.1-4.1-6.2-10.5-6.2-19.1c.1,-.7,.6,-1.9,1.9,-1.9h47.4c.5,0,1,.2,1.3.6s.6.8.6,1.3v4.9c0,4.2,1.1,7.4,3.3,9.5s5.4,3.3,9.5,3.3,7.4-1.1,9.5-3.3c2.2-2.2,3.3-5.4,3.3-9.5v-.4c0-4.3-.6-7.3-1.7-9.2-1.2-1.9-3.4-3.1-6.8-3.8-3.4-.6-8.9-1-16.7-1-12.5,0-22.4-.6-29.9-1.8-7.5-1.2-12.9-3.1-16.4-5.6-3.5-2.6-5.2-6-5.2-10.4s.2-1,.5-1.3c.3-.4.8-.6,1.3-.6h74.9c12.9,0,23,.9,30.4,2.7,7.4,1.8,12.7,4.7,15.9,8.6,3.2,4,4.9,9.4,4.9,16.3v1.3c0,8.8-2.1,15.3-6.2,19.4Z" />
              <path d="M341.2,35.6c.4.4.6.8.6,1.3v32.3c0,4.2,1.1,7.4,3.3,9.5s5.4,3.3,9.5,3.3,7.4-1.1,9.5-3.3c2.2-2.2,3.3-5.4,3.3-9.5v-12.7c0-.5.2-1,.6-1.3.4-.4.8-.6,1.3-.6h47.4c.5,0,1,.2,1.3.6.4.4.6.8.6,1.3v7.4c0,8.3-2.2,14.6-6.5,19-4.4,4.4-10.7,6.6-19.1,6.6h-76.8c-8.3,0-14.6-2.2-19-6.6-4.4-4.4-6.6-10.7-6.6-19v-27c0-.5.2-1,.6-1.3.4-.4.8-.6,1.3-.6h47.4c.5,0,1,.2,1.3.6Z" />
              <path d="M53.2,1.9l14.5,23.2c.3.5.4,1,.1,1.5-.3.5-.6.8-1.2.8H1.9c-.5,0-1-.2-1.3-.6-.4-.4-.6-.8-.6-1.3V1.9c0-.5.2-1,.6-1.3.4-.4.8-.6,1.3-.6h48.1c1.5,0,2.5.6,3.2,1.9Z" />
              <path d="M146.6.6c.4.4.6.8.6,1.3v23.6c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-65c-.5,0-.9-.3-1.2-.8-.3-.5-.2-1,.1-1.5L93.6,1.9c.7-1.3,1.7-1.9,3.2-1.9h48.5c.5,0,1,.2,1.3.6Z" />
              <path d="M155.5,26.8c-.4-.4-.6-.8-.6-1.3v-.6c0-8.8,2-15.1,6.1-19,4.1-3.9,10.6-5.8,19.5-5.8h76.8c8.9,0,15.4,1.9,19.5,5.8,4.1,3.9,6.1,10.2,6.1,19v.6c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-47.4c-.5,0-1-.2-1.3-.6-.4-.4-.6-.8-.6-1.3v-5c0-4.2-1.1-7.4-3.3-9.5-2.2-2.2-5.4-3.3-9.5-3.3s-7.4,1.1-9.5,3.3c-2.2,2.2-3.3,5.4-3.3,9.5v5c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-47.4c-.5,0-1-.2-1.3-.6Z" />
              <path d="M291.1,26.8c-.4-.4-.6-.8-.6-1.3v-1c0-8.2,2.2-14.3,6.5-18.4,4.3-4.1,10.7-6.1,19.1-6.1h76.8c8.4,0,14.8,2,19.1,6.1,4.3,4.1,6.5,10.2,6.5,18.4v1c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-47.4c-.5,0-1-.2-1.3-.6-.4-.4-.6-.8-.6-1.3v-5c0-4.2-1.1-7.4-3.3-9.5-2.2-2.2-5.4-3.3-9.5-3.3s-7.4,1.1-9.5,3.3c-2.2,2.2-3.3,5.4-3.3,9.5v5c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-47.4c-.5,0-1-.2-1.3-.6Z" />
            </svg>
          </NavLink>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="cursor-pointer bg-transparent border-none p-0" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
            {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {/* Mobile expanded menu — absolutely positioned to overlay content below */}
      {mobileMenuOpen && (
        <div
          className="absolute left-0 right-0 lg:hidden px-[var(--padding-x-mobile)] pb-8"
          style={{
            // Expanded mobile menu is a solid block in the hero accent color.
            backgroundColor: 'var(--active-accent, var(--color-accent-art))',
          }}
        >
          <div className="flex justify-between">
            {/* Nav links */}
            {!hidePageNav && (
              <nav className="flex flex-col gap-[20px]">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    prefetch="intent"
                    onClick={() => setMobileMenuOpen(false)}
                    className="cursor-pointer uppercase"
                    style={({isActive}) => ({
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-nav)',
                      fontWeight: isActive ? 800 : 500,
                      fontFeatureSettings: "'salt' 1",
                      color: 'var(--color-black)',
                      textDecoration: 'none',
                    })}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            )}

            {/* Icons stacked vertically */}
            <div className="flex flex-col gap-[10px] items-center">
              <NavLink to="/search" prefetch="intent" className="cursor-pointer text-[var(--color-black)]" onClick={() => setMobileMenuOpen(false)}>
                <SearchIcon />
              </NavLink>
              <NavLink to="/account" prefetch="intent" className="cursor-pointer text-[var(--color-black)]" onClick={() => setMobileMenuOpen(false)}>
                <ProfileIcon />
              </NavLink>
              <NavLink to="/cart" prefetch="intent" className="cursor-pointer text-[var(--color-black)]" onClick={() => setMobileMenuOpen(false)}>
                <CartIcon />
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
