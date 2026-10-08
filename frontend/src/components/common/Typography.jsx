import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';

export const SectionHeading = ({
  tag,
  title,
  description,
  align = 'center',
  className = '',
  ...props
}) => {
  const alignClasses = align === 'left' ? 'text-left items-start' : 'text-center items-center';
  
  return (
    <div className={`flex flex-col gap-2.5 max-w-3xl ${align === 'center' ? 'mx-auto' : ''} ${alignClasses} ${className}`} {...props}>
      {tag && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-teal-500/10 text-teal-300 border border-teal-500/20">
          <Sparkles className="w-3 h-3 text-teal-400 animate-pulse" />
          {tag}
        </span>
      )}
      {title && (
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-normal">
          {description}
        </p>
      )}
    </div>
  );
};

export const PageBanner = ({
  title,
  description,
  breadcrumbs = [],
  image = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`glass-card-premium rounded-3xl p-6 sm:p-10 mb-8 relative overflow-hidden text-left border border-white/10 ${className}`} {...props}>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full relative z-10">
        <div className={`flex flex-col gap-3 ${image ? 'md:col-span-8' : 'md:col-span-12'}`}>
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={idx}>
                    {crumb.path ? (
                      <Link to={crumb.path} className="text-teal-400 hover:text-teal-300 transition-colors">
                        {crumb.name}
                      </Link>
                    ) : (
                      <span className="text-slate-300">{crumb.name}</span>
                    )}
                    {!isLast && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                  </React.Fragment>
                );
              })}
            </nav>
          )}

          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed max-w-2xl font-normal">
                {description}
              </p>
            )}
          </div>
        </div>

        {image && (
          <div className="md:col-span-4 hidden md:flex items-center justify-end relative">
            <div className="relative w-80 h-36 rounded-2xl overflow-hidden border border-white/15 shadow-2xl p-1 bg-white/5 backdrop-blur-md">
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
