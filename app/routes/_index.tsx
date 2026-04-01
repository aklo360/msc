import type {Route} from './+types/_index';
import {HomeHero} from '~/components/HomeHero';

export const meta: Route.MetaFunction = () => {
  return [{title: 'MSC | Mr. StarCity'}];
};

export default function Homepage() {
  return (
    <div>
      <HomeHero accentColor="#FF9E70" />
    </div>
  );
}
