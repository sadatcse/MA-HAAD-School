import { PortalIndex, portalIndexMetadata } from '@/views/PortalViews';

export const metadata = portalIndexMetadata('requisition');

export default function Page() {
  return <PortalIndex groupKey="requisition" />;
}
