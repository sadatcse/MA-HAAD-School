import { PortalIndex, portalIndexMetadata } from '@/views/PortalViews';

export const metadata = portalIndexMetadata('portal');

export default function Page() {
  return <PortalIndex groupKey="portal" />;
}
