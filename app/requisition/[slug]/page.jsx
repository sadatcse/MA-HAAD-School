import { PortalPage, portalMetadata, portalParams } from '@/views/PortalViews';

export const generateStaticParams = () => portalParams('requisition');
export const generateMetadata = ({ params }) => portalMetadata('requisition', params);

export default function Page({ params }) {
  return <PortalPage groupKey="requisition" params={params} />;
}
