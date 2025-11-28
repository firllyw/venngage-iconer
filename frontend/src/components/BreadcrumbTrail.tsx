import { ChevronRight } from 'lucide-react';

const crumbs = ['Venngage Labs', 'Icon Systems', 'Style Ensembles'];

export const BreadcrumbTrail = () => (
  <nav className="breadcrumbs" aria-label="Breadcrumb">
    {crumbs.map((crumb, index) => (
      <span key={crumb}>
        {crumb}
        {index < crumbs.length - 1 && <ChevronRight size={16} style={{ margin: '0 0.35rem' }} />}
      </span>
    ))}
  </nav>
);
