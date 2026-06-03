import type {Route} from './+types/shop._index';
import {SectionHero} from '~/components/SectionHero';
import {ShopCard} from '~/components/ShopCard';

export const meta: Route.MetaFunction = () => {
  return [{title: 'MSC Shop | Mr.StarCity'}];
};

const ACCENT_SHOP = '#73B9D0';

const PLACEHOLDER_PRODUCTS = [
  {title: 'Loverboy Sculpture', price: '$480', seriesTag: 'Loverboy', href: '/products/loverboy-sculpture'},
  {title: 'Loverboy Bag \u2014 Black', price: '$120', seriesTag: 'Loverboy', href: '/products/loverboy-bag-black'},
  {title: 'Loverboy Bag \u2014 Green', price: '$120', seriesTag: 'Loverboy', href: '/products/loverboy-bag-green'},
  {title: 'Love Me Love Me Not Tee', price: '$55', seriesTag: 'Bloomer', href: '/products/love-me-tee'},
  {title: 'Love Me Love Me Not Hoodie', price: '$95', seriesTag: 'Bloomer', href: '/products/love-me-hoodie'},
  {title: 'Moonlit Roses Tee', price: '$55', seriesTag: 'Loverboy', href: '/products/moonlit-roses-tee'},
  {title: 'Moonlit Roses Hoodie', price: '$95', seriesTag: 'Loverboy', href: '/products/moonlit-roses-hoodie'},
  {title: 'Loverboy Sculpture Mini', price: '$180', seriesTag: 'Loverboy', href: '/products/loverboy-sculpture-mini'},
];

/**
 * Shop menu bar: "SHOP: ALL" left, "SORT: RECOMMENDED" right.
 * Same height/padding as ArtMenu (100px tall, px-60, py-30).
 */
function ShopMenu() {
  return (
    <div className="flex items-center justify-between h-[100px] px-[60px] max-md:px-[20px] py-[30px]">
      <span className="font-[family-name:var(--font-body,_sans-serif)] text-[18px] max-md:text-[14px] font-medium leading-[1.2] uppercase text-black">
        Shop: All
      </span>
      <span className="font-[family-name:var(--font-body,_sans-serif)] text-[18px] max-md:text-[14px] font-medium leading-[1.2] uppercase text-black">
        Sort: Recommended
      </span>
    </div>
  );
}

export default function ShopIndex() {
  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero */}
      <SectionHero title="MSC Shop" accentColor={ACCENT_SHOP} videoSrc="/videos/shop/page-bg.mp4" />

      {/* Shop Menu */}
      <ShopMenu />

      {/* Product Grid */}
      <div className="px-[60px] max-md:px-[20px] py-[30px] pb-[120px]">
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-x-[20px] gap-y-[60px]">
          {PLACEHOLDER_PRODUCTS.map((product) => (
            <ShopCard
              key={product.href}
              title={product.title}
              price={product.price}
              seriesTag={product.seriesTag}
              href={product.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
