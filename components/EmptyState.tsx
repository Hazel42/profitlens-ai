import React from 'react';
import { PlusIcon } from './icons/PlusIcon';

interface EmptyStateProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ Icon, title, message, actionText, onAction, secondaryActionText, onSecondaryAction }) => {
  return (
    <div className="text-center bg-gray-800 rounded-lg p-12">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-primary/10">
        <Icon className="h-8 w-8 text-brand-secondary" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-2xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-base text-gray-400 max-w-md mx-auto">{message}</p>
      <div className="mt-6 flex justify-center items-center gap-4">
        {actionText && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            {actionText}
          </button>
        )}
        {secondaryActionText && onSecondaryAction && (
           <button
            type="button"
            onClick={onSecondaryAction}
            className="inline-flex items-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
