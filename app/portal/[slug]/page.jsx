import { PortalPage, portalMetadata, portalParams } from '@/views/PortalViews';

export const generateStaticParams = () => portalParams('portal');
export const generateMetadata = ({ params }) => portalMetadata('portal', params);

export default function Page({ params }) {
  return <PortalPage groupKey="portal" params={params} />;
}
